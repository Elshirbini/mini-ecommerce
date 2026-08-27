import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../enums/userRole.enum';
import { Order } from 'src/order/graphql/order.type';
import { AutoMap } from '@automapper/classes';

@ObjectType()
export class User {
  @AutoMap()
  @Field(() => ID)
  id!: string;

  @AutoMap()
  @Field({ deprecationReason: 'User fullName' })
  name!: string;

  @AutoMap()
  @Field()
  fullName!: string;

  @AutoMap()
  @Field()
  email!: string;

  @AutoMap()
  @Field({ nullable: true })
  imageUrl?: string;

  @AutoMap()
  @Field(() => UserRole)
  role!: UserRole;

  @Field(() => [Order])
  orders?: Order[];
}
