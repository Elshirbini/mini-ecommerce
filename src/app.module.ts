import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import depthLimit from 'graphql-depth-limit';
import { ComplexityPlugin } from './complexity.plugin';
import { OrderService } from './order/order.service';
import { createOrderLoader } from './order/loaders/order.loader';
import { RedisModule } from './redis/redis.module';
import { winstonLogger } from './common/winston-logger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Redis } from 'ioredis';
import { APP_GUARD } from '@nestjs/core';
import { GracefulShutdownService } from './common/graceful-shutdown.service';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { GqlThrottlerGuard } from './common/guards/gql-throttler.guard';
import { GraphQLLoggingPlugin } from './common/plugins/graphqlLogging.plugin';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [OrderModule],
      inject: [OrderService],
      useFactory: (orderService: OrderService) => ({
        allowBatchedHttpRequests: true,
        introspection: process.env.NODE_ENV === 'dev',
        persistedQueries: {},
        autoSchemaFile: join(process.cwd(), 'src', 'graphql', 'schema.gql'),
        validationRules: [depthLimit(10)], // 10 depth max limit
        formatError: (formattedError, error) => {
          winstonLogger.error({
            type: 'graphql_error',
            message: formattedError.message,
            code: formattedError.extensions?.code,
            path: formattedError.path,
            stack: error instanceof Error ? error.stack : undefined,
          });

          return formattedError;
        },
        context: (request: FastifyRequest, reply: FastifyReply) => ({
          request,
          reply,
          orderLoader: createOrderLoader(orderService),
        }),
        plugins: [GraphQLLoggingPlugin],
      }),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const redis = new Redis({
          host:
            configService.get('NODE_ENV') === 'prod'
              ? 'redis'
              : configService.get<string>('REDIS_HOST'),

          port:
            configService.get('NODE_ENV') === 'prod'
              ? 6379
              : Number(configService.get('REDIS_PORT')),

          password:
            configService.get('NODE_ENV') === 'prod'
              ? undefined
              : configService.get<string>('REDIS_PASSWORD'),
        });

        return {
          throttlers: [
            {
              ttl: 1 * 60 * 1000,
              limit: 3000,
            },
          ],

          storage: new ThrottlerStorageRedisService(redis),
        };
      },
    }),
    MongooseModule.forRoot(process.env.DB_URL!),
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
    UserModule,
    OrderModule,
    AuthModule,
    RedisModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: GqlThrottlerGuard },
    ComplexityPlugin,
    GracefulShutdownService,
  ],
})
export class AppModule {}
