import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AddToCartInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  quantity!: number;
}
