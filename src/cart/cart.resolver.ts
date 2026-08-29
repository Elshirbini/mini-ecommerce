import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './graphql/cart.type';
import { AddToCartInput } from './graphql/addToCart.input';
import { GraphQLContext } from 'src/graphql/graphql-context';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Cart)
  addToCart(
    @Context() ctx: GraphQLContext,
    @Args('input') productData: AddToCartInput,
  ) {
    return this.cartService.addToCart(ctx, productData);
  }
}
