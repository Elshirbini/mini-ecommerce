import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './graphql/order.type';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GraphQLContext } from 'src/graphql/graphql-context';
import { MakeOrderInput } from './graphql/order.input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  // @Query(() => [Order])
  // async orders(): Promise<Order[]> {
  //   const orders = await this.orderService.findAll();
  //   return orders.map((order) => ({
  //     id: order._id.toString(),
  //     total: order.total,
  //   }));
  // }

  @UseGuards(AuthGuard)
  @Mutation(() => Order)
  makeOrder(
    @Context() ctx: GraphQLContext,
    @Args('input', { nullable: true }) orderData?: MakeOrderInput,
  ) {
    return this.orderService.makeOrder(ctx, orderData);
  }
}
