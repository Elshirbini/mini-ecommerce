import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';
import { UserModule } from 'src/user/user.module';
import { DatabaseChannel } from './channels/database.channel';
import { GraphQLPubSubChannel } from './channels/graphql-pubsub.channel';
import { NotificationMapper } from './mappers/notification.mapper';
import { NotificationResolver } from './notification.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    JwtModule,
    forwardRef(() => UserModule),
  ],
  providers: [
    NotificationResolver,
    NotificationService,
    NotificationRepository,
    DatabaseChannel,
    GraphQLPubSubChannel,
    NotificationMapper,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
