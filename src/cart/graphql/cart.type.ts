import { AutoMap } from '@automapper/classes';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Item {
  @AutoMap()
  @Field(() => ID)
  productId!: string;

  @AutoMap()
  @Field(() => Number)
  price!: number;

  @AutoMap()
  @Field(() => Int)
  quantity!: number;

  @AutoMap()
  @Field(() => Number)
  totalPrice!: number;
}

@ObjectType()
export class Cart {
  @AutoMap()
  @Field(() => ID)
  cartId!: string;

  @AutoMap()
  @Field(() => ID)
  userId!: string;

  @AutoMap()
  @Field(() => Number)
  total!: number;

  @AutoMap(() => [Item])
  @Field(() => [Item])
  items!: Item[];
}
