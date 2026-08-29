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
import { Order } from 'src/order/graphql/order.type';
import { GraphQLContext } from '../graphql/graphql-context';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UsersResponse } from './graphql/users-response.type';
import { UserFilterInput } from './graphql/user-filter.input';
import { UpdateUserInput } from './graphql/update-user.input';
import GraphQLUpload, { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';

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
      fullName: user.name,
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

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Context() ctx: GraphQLContext,
    @Args('input', { nullable: true }) userData: UpdateUserInput,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file?: Promise<FileUpload>,
  ) {
    return this.userService.updateUser(ctx, userData, file);
  }

  @ResolveField(() => [Order])
  async orders(
    @Parent() user: User,
    @Context() context: GraphQLContext,
  ): Promise<Order[]> {
    return context.orderLoader.load(user.id);
  }
}
