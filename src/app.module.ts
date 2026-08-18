import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import depthLimit from 'graphql-depth-limit';
import { ComplexityPlugin } from './complexity.plugin';
import { OrderService } from './order/order.service';
import { createOrderLoader } from './order/loaders/order.loader';
import { RedisModule } from './redis/redis.module';
import { winstonLogger } from './common/winston-logger';
import { FastifyReply, FastifyRequest } from 'fastify';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [OrderModule],
      inject: [OrderService],
      useFactory: (orderService: OrderService) => ({
        allowBatchedHttpRequests: true,
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
      }),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.DB_URL!),
    UserModule,
    OrderModule,
    AuthModule,
    RedisModule,
  ],
  providers: [ComplexityPlugin],
})
export class AppModule {}
