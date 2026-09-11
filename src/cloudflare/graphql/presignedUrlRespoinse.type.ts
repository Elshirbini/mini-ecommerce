import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class PresignedUrlResponse {
  @Field()
  url!: string;

  @Field()
  key!: string;

  @Field(() => GraphQLJSON)
  headers!: Record<string, string>;
}
