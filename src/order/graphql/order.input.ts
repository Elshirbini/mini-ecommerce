import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class OrderItem {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  quantity!: number;
}

@InputType()
export class MakeOrderInput {
  //   @Field(() => ID, { nullable: true })
  //   cartId?: string;

  @Field(() => [OrderItem], { nullable: true })
  items?: OrderItem[];
}
