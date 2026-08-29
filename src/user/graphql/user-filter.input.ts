import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Max } from 'class-validator';

@InputType()
export class UserFilterInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsNotEmpty()
  page!: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsNotEmpty()
  @Max(50)
  limit!: number;

  @Field({ nullable: true })
  @IsOptional()
  after?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  search?: string;
}
