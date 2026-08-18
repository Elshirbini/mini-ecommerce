import { Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './graphql/order.type';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [Order])
  async orders(): Promise<Order[]> {
    const orders = await this.orderService.findAll();
    return orders.map((order) => ({
      id: order._id.toString(),
      total: order.total,
      status: order.status,
    }));
  }
}
