import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { ProductMapper } from './mappers/product.mapper';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudflareModule } from 'src/cloudflare/cloudflare.module';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductRepository } from './product.repository';
import { ImageProcessorService } from 'src/common/image/image-processor.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CloudflareModule,
  ],
  providers: [
    ProductResolver,
    ProductService,
    ProductMapper,
    ProductRepository,
    ImageProcessorService,
  ],
  exports: [ProductRepository],
})
export class ProductModule {}
