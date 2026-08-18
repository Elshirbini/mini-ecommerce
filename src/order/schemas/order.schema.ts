import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = OrderModel & Document;

@Schema({ timestamps: true })
export class OrderModel {
  @Prop({ required: true, ref: 'User', index: true })
  userId!: string;

  @Prop({ required: true })
  total!: number;

  @Prop({ required: true })
  status!: string;
}

export const OrderSchema = SchemaFactory.createForClass(OrderModel);
