import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Order {
  @Field(() => ID)
  id!: string;

  @Field(() => Float)
  total!: number;

  @Field()
  status!: string;
}
