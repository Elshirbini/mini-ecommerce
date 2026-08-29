import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationMeta {
  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalCount!: number;

  @Field(() => Boolean)
  hasNextPage!: boolean;

  @Field({ nullable: true })
  endCursor?: string;
}
