import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ _id: false })
export class CartItem {
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

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
  @AutoMap()
  _id!: Types.ObjectId;

  @AutoMap()
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId!: Types.ObjectId;

  @AutoMap(() => [CartItem])
  @Prop({
    type: [CartItemSchema],
    default: [],
  })
  items!: CartItem[];

  @AutoMap()
  @Prop({
    required: true,
    min: 0,
    default: 0,
  })
  total!: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
