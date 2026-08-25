import { Mapper } from '@automapper/core';
import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { User as MongoUser } from '../schemas/user.schema';
import { User as GraphQLUser } from '../graphql/user.type';

export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        MongoUser,
        GraphQLUser,

        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id.toString()),
        ),
      );
    };
  }
}
