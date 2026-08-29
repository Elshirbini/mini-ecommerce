import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) readonly productModel: Model<Product>,
  ) {}

  async createProduct(data: Partial<ProductDocument>) {
    return this.productModel.create(data);
  }

  async findProductById(id: string) {
    return this.productModel.findById(id);
  }
}
