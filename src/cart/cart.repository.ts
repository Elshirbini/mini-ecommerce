import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model, QueryFilter } from 'mongoose';

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
  ) {}

  async createCart(cartData: Partial<Cart>) {
    return this.cartModel.create(cartData);
  }

  async findCartByQuery(query: QueryFilter<Cart>) {
    return this.cartModel.findOne(query);
  }

  async saveCart(cart: CartDocument) {
    return cart.save();
  }
}
