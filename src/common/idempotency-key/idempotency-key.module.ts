import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  IdempotencyKey,
  IdempotencyKeySchema,
} from './schema/idempotency-key.schema';
import { IdempotencyRepository } from './idempotency-key.repository';
import { IdempotencyInterceptor } from './idempotency-key.interceptor';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IdempotencyKey.name, schema: IdempotencyKeySchema },
    ]),
  ],
  controllers: [],
  providers: [IdempotencyRepository, IdempotencyInterceptor],
  exports: [IdempotencyRepository, IdempotencyInterceptor],
})
export class IdempotencyKeyModule {}
