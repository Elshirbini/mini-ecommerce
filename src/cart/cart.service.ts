import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { GraphQLContext } from 'src/graphql/graphql-context';
import { ProductRepository } from 'src/product/product.repository';
import { AddToCartInput } from './graphql/addToCart.input';
import { Types } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Cart as GraphQLCart } from './graphql/cart.type';
import { Cart as MongoCart } from './schemas/cart.schema';

@Injectable()
export class CartService {
  logger = new Logger(CartService.name);
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly productRepo: ProductRepository,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async addToCart(
    ctx: GraphQLContext,
    productData: AddToCartInput,
  ): Promise<GraphQLCart> {
    const userId = ctx.request.userId!;
    this.logger.log(userId);

    const product = await this.productRepo.findProductById(
      productData.productId,
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.quantity < productData.quantity) {
      throw new ForbiddenException('Sufficient items in stock');
    }

    let cart = await this.cartRepo.findCartByQuery({
      userId: new Types.ObjectId(userId),
    });

    if (cart) {
      const index = cart.items.findIndex(
        (item) => item.productId._id.toString() === productData.productId,
      );

      if (index !== -1) {
        cart.items[index].quantity += productData.quantity;
        cart.items[index].totalPrice =
          (product.price - product.discount) * cart.items[index].quantity;
      } else {
        cart.items.push({
          productId: product._id,
          price: product.price,
          quantity: productData.quantity,
          totalPrice: (product.price - product.discount) * productData.quantity,
        });
      }
      cart.total = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

      cart = await this.cartRepo.saveCart(cart);
    } else {
      const item = {
        productId: product._id,
        price: product.price,
        quantity: productData.quantity,
        totalPrice: (product.price - product.discount) * productData.quantity,
      };
      const total = item.totalPrice;

      cart = await this.cartRepo.createCart({
        userId: new Types.ObjectId(userId),
        items: [item],
        total,
      });
    }

    return this.mapper.map(cart, MongoCart, GraphQLCart);
  }
}
