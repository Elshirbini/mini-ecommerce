import { AutoMap } from '@automapper/classes';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Item } from 'src/cart/graphql/cart.type';

@ObjectType()
export class Order {
  @AutoMap()
  @Field(() => ID)
  orderId!: string;

  @AutoMap()
  @Field(() => ID)
  userId!: string;

  @AutoMap()
  @Field(() => Boolean)
  isPaid!: boolean;

  @AutoMap()
  @Field(() => Boolean)
  isDelivered!: boolean;

  @AutoMap()
  @Field(() => Float)
  total!: number;

  @AutoMap(() => [Item])
  @Field(() => [Item])
  cartItems!: Item[];
}
