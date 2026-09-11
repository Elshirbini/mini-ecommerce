import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class GeneratePresignedUrlInput {
  @Field()
  @IsNotEmpty()
  key!: string;

  @Field()
  @IsNotEmpty()
  @IsNotEmpty()
  mimetype!: string;

  @Field(() => Int)
  @IsNotEmpty()
  expiresIn!: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsNotEmpty()
  metaData?: Record<string, string>;
}
