import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModel, OrderSchema } from './schemas/order.schema';
import { OrderRepository } from './order.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OrderModel.name, schema: OrderSchema }]),
  ],
  providers: [OrderResolver, OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrderModule {}
