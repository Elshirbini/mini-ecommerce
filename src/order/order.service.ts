import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderModel, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async create(orderData: Partial<OrderModel>): Promise<OrderDocument> {
    return this.orderRepository.create(orderData);
  }

  async findByUserId(userId: string): Promise<OrderDocument[]> {
    return this.orderRepository.findByUserId(userId);
  }

  async findAll(): Promise<OrderDocument[]> {
    return this.orderRepository.findAll();
  }

  async findByUserIds(userIds: readonly string[]) {
    return this.orderRepository.findByUserIds(userIds);
  }
}
