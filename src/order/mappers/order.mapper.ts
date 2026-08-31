import { Mapper } from '@automapper/core';
import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import {
  Order as MongoOrder,
  OrderItem as MongoOrderItem,
} from '../schemas/order.schema';

import { Order as GraphQLOrder } from '../graphql/order.type';
import { Item as GraphQLOrderItem } from '../../cart/graphql/cart.type';

export class OrderMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        MongoOrderItem,
        GraphQLOrderItem,

        forMember(
          (dest) => dest.productId,
          mapFrom((src) => src.productId.toString()),
        ),
      );

      createMap(
        mapper,
        MongoOrder,
        GraphQLOrder,

        forMember(
          (dest) => dest.userId,
          mapFrom((src) => src.userId.toString()),
        ),

        forMember(
          (dest) => dest.orderId,
          mapFrom((src) => src._id.toString()),
        ),

        forMember(
          (dest) => dest.cartItems,
          mapFrom((src) =>
            mapper.mapArray(src.cartItems, MongoOrderItem, GraphQLOrderItem),
          ),
        ),
      );
    };
  }
}
