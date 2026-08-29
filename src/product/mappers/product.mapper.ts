import { Mapper } from '@automapper/core';
import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Product as MongoProduct } from '../schemas/product.schema';
import { Product as GraphQLProduct } from '../graphql/product.type';

export class ProductMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        MongoProduct,
        GraphQLProduct,

        forMember(
          (dest) => dest.productId,
          mapFrom((src) => src._id.toString()),
        ),
        forMember(
          (dest) => dest.thumbnail,
          mapFrom((src) => src.thumbnail),
        ),

        forMember(
          (dest) => dest.images,
          mapFrom((src) => src.images),
        ),
      );
    };
  }
}
