import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {
  @AutoMap()
  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId!: Types.ObjectId;

  @AutoMap()
  @Prop({
    required: true,
    min: 1,
  })
  quantity!: number;

  @AutoMap()
  @Prop({
    required: true,
    min: 0,
  })
  price!: number;

  @AutoMap()
  @Prop({
    required: true,
    min: 0,
  })
  totalPrice!: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @AutoMap()
  _id!: Types.ObjectId;

  @AutoMap()
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId!: Types.ObjectId;

  @AutoMap()
  @Prop({
    required: true,
    min: 0,
  })
  total!: number;

  @AutoMap()
  @Prop({
    type: Boolean,
    required: true,
  })
  isPaid!: boolean;

  @AutoMap()
  @Prop({
    type: Boolean,
    required: true,
  })
  isDelivered!: boolean;

  @AutoMap(() => [OrderItem])
  @Prop({
    type: [OrderItemSchema],
    required: true,
    default: [],
  })
  cartItems!: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
