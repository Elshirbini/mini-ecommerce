import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IdempotencyKeyDocument = IdempotencyKey & Document;

@Schema({ timestamps: true })
export class IdempotencyKey {
  @Prop({ required: true, unique: true })
  key!: string;

  @Prop({ required: true })
  endpoint!: string;

  @Prop({ required: true })
  requestHash!: string;

  @Prop({ type: Object })
  response?: Record<string, any>;

  @Prop({ type: Number, required: true })
  statusCode!: number;
}

export const IdempotencyKeySchema =
  SchemaFactory.createForClass(IdempotencyKey);
