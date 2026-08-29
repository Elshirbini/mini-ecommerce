import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(orderData: Partial<Order>): Promise<OrderDocument> {
    const createdOrder = new this.orderModel(orderData);
    return createdOrder.save();
  }

  async findByUserId(userId: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ userId }).exec();
  }

  async findAll(): Promise<OrderDocument[]> {
    return this.orderModel.find().exec();
  }

  async findByUserIds(userIds: readonly string[]) {
    return this.orderModel.find({
      userId: {
        $in: userIds,
      },
    });
  }
}
