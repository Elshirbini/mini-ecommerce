import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderRepository } from './order.repository';
import { CartModule } from 'src/cart/cart.module';
import { OrderMapper } from './mappers/order.mapper';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    JwtModule,
    CommonModule,
    CartModule,
    ProductModule,
    NotificationModule,
    forwardRef(() => UserModule),
  ],
  providers: [OrderResolver, OrderService, OrderRepository, OrderMapper],
  exports: [OrderService],
})
export class OrderModule {}
