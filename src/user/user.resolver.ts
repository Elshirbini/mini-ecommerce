import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './graphql/user.type';
import { CreateUserInput } from './graphql/user.input';
import { Order } from 'src/order/graphql/order.type';
import { GraphQLContext } from '../graphql/graphql-context';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UsersResponse } from './graphql/users-response.type';
import { UserFilterInput } from './graphql/user-filter.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Query(() => User)
  async user(@Context() ctx: GraphQLContext): Promise<User> {
    const user = await this.userService.getUser(ctx);

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  @Query(() => UsersResponse)
  async users(
    @Args('filter', { type: () => UserFilterInput }) filter: UserFilterInput,
  ): Promise<UsersResponse> {
    return this.userService.getUsers(filter);
  }

  @ResolveField(() => [Order])
  async orders(
    @Parent() user: User,
    @Context() context: GraphQLContext,
  ): Promise<Order[]> {
    return context.orderLoader.load(user.id);
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    // Note: Usually signup is done via AuthModule.
    // Keeping this simple or delegating.
    const createdUser = await this.userService.create(input);
    return {
      id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
    };
  }
}
