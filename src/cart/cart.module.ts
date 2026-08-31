import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CartRepository } from './cart.repository';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';
import { CartMapper } from './mappers/cart.mapper';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductModule,
    JwtModule,
    CommonModule,
  ],
  providers: [CartResolver, CartService, CartRepository, CartMapper],
  exports: [CartRepository],
})
export class CartModule {}
