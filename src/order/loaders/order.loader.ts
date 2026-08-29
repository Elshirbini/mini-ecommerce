// order/loaders/order.loader.ts

import DataLoader from 'dataloader';
import { OrderService } from '../order.service';
import { Order } from '../graphql/order.type';

export function createOrderLoader(
  orderService: OrderService,
): DataLoader<string, Order[]> {
  return new DataLoader<string, Order[]>(async (userIds) => {
    console.log('BATCH:', userIds);

    const orders = await orderService.findByUserIds(userIds);

    const ordersByUserId = new Map<string, Order[]>();

    for (const userId of userIds) {
      ordersByUserId.set(userId, []);
    }

    for (const order of orders) {
      const userId = order.userId.toString();

      ordersByUserId.get(userId)?.push({
        id: order._id.toString(),
        total: order.total,
      });
    }

    return userIds.map((userId) => ordersByUserId.get(userId) ?? []);
  });
}
