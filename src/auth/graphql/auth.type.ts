import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/graphql/user.type';

@ObjectType()
export class AuthPayload {
  @Field(() => User)
  user!: User;
}
