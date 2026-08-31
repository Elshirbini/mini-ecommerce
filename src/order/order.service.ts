import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CartRepository } from 'src/cart/cart.repository';
import { GraphQLContext } from 'src/graphql/graphql-context';
import { UserRepository } from 'src/user/user.repository';
import { Types } from 'mongoose';
import { MakeOrderInput } from './graphql/order.input';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Order as MongoOrder } from './schemas/order.schema';
import { Order as GraphQLOrder } from './graphql/order.type';
import { ProductRepository } from 'src/product/product.repository';
import { CartItem } from 'src/cart/schemas/cart.schema';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly cartRepo: CartRepository,
    private readonly userRepo: UserRepository,
    private readonly productRepo: ProductRepository,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async makeOrder(ctx: GraphQLContext, orderData?: MakeOrderInput) {
    const userId = ctx.request.userId!;
    let totalPrice: number = 0;

    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const cart = await this.cartRepo.findCartByQuery({
      userId: user._id,
    });
    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    const productIds = cart.items.map((i) => new Types.ObjectId(i.productId));
    const products = await this.productRepo.findProductsByIds(productIds);

    const invalidProducts: string[] = [];
    const validItems: CartItem[] = [];

    for (const item of cart.items) {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString(),
      );

      if (!product) {
        invalidProducts.push(`Product ${item.productId?.toString()} not found`);
        continue;
      }

      if (product.quantity < item.quantity) {
        invalidProducts.push(`${product.title} is out of stock`);
        continue;
      }

      const currentPrice = product.price - product.discount;
      totalPrice = currentPrice * item.quantity;

      validItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: currentPrice,
        totalPrice,
      });
    }

    if (invalidProducts.length > 0) {
      throw new NotFoundException(
        `Some products are invalid or unavailable: ${invalidProducts.join(', ')}`,
      );
    }

    totalPrice = validItems.reduce((acc, i) => acc + i.totalPrice, 0);

    const order = await this.orderRepo.create({
      userId: new Types.ObjectId(userId),
      cartItems: validItems,
      isPaid: false,
      isDelivered: false,
      total: totalPrice,
    });

    return this.mapper.map(order, MongoOrder, GraphQLOrder);
  }
}
