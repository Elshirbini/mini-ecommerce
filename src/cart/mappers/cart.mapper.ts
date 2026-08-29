import { Mapper } from '@automapper/core';
import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import {
  Cart as MongoCart,
  CartItem as MongoCartItem,
} from '../schemas/cart.schema';

import {
  Cart as GraphQLCart,
  Item as GraphQLCartItem,
} from '../graphql/cart.type';

export class CartMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        MongoCartItem,
        GraphQLCartItem,

        forMember(
          (dest) => dest.productId,
          mapFrom((src) => src.productId.toString()),
        ),
      );

      createMap(
        mapper,
        MongoCart,
        GraphQLCart,

        forMember(
          (dest) => dest.cartId,
          mapFrom((src) => src._id.toString()),
        ),

        forMember(
          (dest) => dest.items,
          mapFrom((src) =>
            mapper.mapArray(src.items, MongoCartItem, GraphQLCartItem),
          ),
        ),
      );
    };
  }
}
