import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AutoMap } from '@automapper/classes';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class Notification {
  @AutoMap()
  @Field(() => ID)
  _id!: string;

  @AutoMap()
  @Field(() => ID)
  userId!: string;

  @AutoMap()
  @Field()
  title!: string;

  @AutoMap()
  @Field()
  body!: string;

  @AutoMap()
  @Field(() => GraphQLJSONObject, { nullable: true })
  data?: Record<string, any>;

  @AutoMap()
  @Field()
  type!: string;

  @AutoMap()
  @Field({ nullable: true })
  link?: string;

  @AutoMap()
  @Field()
  is_read!: boolean;

  @AutoMap()
  @Field({ nullable: true })
  read_at?: Date;

  @AutoMap()
  @Field()
  createdAt!: Date;
}
