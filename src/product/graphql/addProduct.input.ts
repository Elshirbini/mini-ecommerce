import { AutoMap } from '@automapper/classes';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class AddProductInput {
  @AutoMap()
  @Field()
  @IsNotEmpty()
  @IsString()
  title!: string;

  @AutoMap()
  @Field()
  @IsNotEmpty()
  @IsString()
  description!: string;

  @AutoMap()
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @AutoMap()
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  discount!: number;

  @AutoMap()
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  quantity!: number;
}
