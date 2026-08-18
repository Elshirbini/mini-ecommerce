import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.type';
import { PaginationMeta } from './pagination-meta.type';

@ObjectType()
export class UsersResponse {
  @Field(() => [User])
  users!: User[];

  @Field(() => PaginationMeta)
  meta!: PaginationMeta;
}
