import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Mapper } from '@automapper/core';

import { Notification as MongoNotification } from '../schemas/notification.schema';
import { Notification as GraphQLNotification } from '../graphql/notification.type';

@Injectable()
export class NotificationMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        MongoNotification,
        GraphQLNotification,

        forMember(
          (dest) => dest._id,
          mapFrom((src) => src._id.toString()),
        ),

        forMember(
          (dest) => dest.userId,
          mapFrom((src) => src.userId.toString()),
        ),
      );
    };
  }
}
