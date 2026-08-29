import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './graphql/product.type';
import { AddProductInput } from './graphql/addProduct.input';
import GraphQLUpload, { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  addProduct(
    @Args('input', { type: () => AddProductInput })
    productData: AddProductInput,
    @Args('thumbnail', { type: () => GraphQLUpload, nullable: true })
    thumbnail?: Promise<FileUpload>,
    @Args('images', { type: () => [GraphQLUpload], nullable: true })
    images?: Promise<FileUpload>[],
  ) {
    return this.productService.addProduct(productData, thumbnail, images);
  }
}
