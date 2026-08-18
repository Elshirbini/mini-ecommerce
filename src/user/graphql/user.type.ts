import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../enums/userRole.enum';
import { Order } from 'src/order/graphql/order.type';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field(() => UserRole)
  role!: UserRole;

  @Field(() => [Order])
  orders?: Order[];
}
