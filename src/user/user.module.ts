import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { OrderModule } from 'src/order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './user.repository';
import { RedisModule } from 'src/redis/redis.module';
import { CommonModule } from 'src/common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { UserProfile } from './mappers/user.profile';
import { CloudflareModule } from 'src/cloudflare/cloudflare.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    OrderModule,
    RedisModule,
    CommonModule,
    JwtModule,
    CloudflareModule,
  ],
  providers: [UserResolver, UserService, UserRepository, UserProfile],
  exports: [UserService],
})
export class UserModule {}
