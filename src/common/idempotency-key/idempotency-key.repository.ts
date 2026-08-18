import { Injectable } from '@nestjs/common';
import {
  IdempotencyKey,
  IdempotencyKeyDocument,
} from './schema/idempotency-key.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class IdempotencyRepository {
  constructor(
    @InjectModel(IdempotencyKey.name)
    private idempotencyKeyModel: Model<IdempotencyKey>,
  ) {}

  async createIdempotencyKey(idempotencyKey: IdempotencyKey) {
    return this.idempotencyKeyModel.create(idempotencyKey);
  }

  async findIdempotencyKeyByKey(key: string) {
    return this.idempotencyKeyModel.findOne({ key });
  }

  async saveIdempotencyKey(idempotencyKey: IdempotencyKeyDocument) {
    return idempotencyKey.save();
  }
}
