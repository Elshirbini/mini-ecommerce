import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { QueryInput } from './graphql/query.input';
import { DatabaseChannel } from './channels/database.channel';
import { GraphQLPubSubChannel } from './channels/graphql-pubsub.channel';

import { SendNotificationDto } from './interfaces/notification-channel.interface';
import { NotificationChannel } from './enums/notification.enums';
import { GraphQLContext } from 'src/graphql/graphql-context';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Notification as MongoNotification } from './schemas/notification.schema';
import { Notification as GraphQLNotification } from './graphql/notification.type';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly notificationRepo: NotificationRepository,
    private readonly databaseChannel: DatabaseChannel,
    private readonly graphqlPubSubChannel: GraphQLPubSubChannel,

    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  /**
   * Unified notification dispatch.
   *
   * - `database` → persists a Notification document in MongoDB (automatic when included)
   * - `socket`   → emits a real-time event to the user's socket room
   * - `fcm`      → sends a Firebase push notification to the user's device
   * - `whatsapp` → sends a WhatsApp message to the user's phone number via Twilio
   *
   * The saved DB document is used as the socket payload so the client receives
   * the full notification object (including _id, createdAt, is_read, etc.)
   * without any extra round-trips.
   */
  async send(dto: SendNotificationDto): Promise<void> {
    let savedNotification: any = null;

    // ── Step 1: Persist to MongoDB ──────────────────────────────────────────
    if (dto.channels.includes(NotificationChannel.DATABASE)) {
      try {
        savedNotification = await this.databaseChannel.send(dto);
      } catch (err: unknown) {
        this.logger.error(`DatabaseChannel failed for user ${dto.userId}`, err);
      }
    }

    // ── Step 2: Publish to GraphQL PubSub (WebSocket subscribers) ───────────
    //
    // We publish AFTER the DB save so subscribers receive the full document
    // (with _id, createdAt, is_read, etc.) rather than just the raw DTO.
    //
    // If the DB save failed, we still publish the raw DTO as a fallback so
    // that real-time clients are not silently dropped.
    if (dto.channels.includes(NotificationChannel.GRAPHQL_PUBSUB)) {
      await this.graphqlPubSubChannel.send(savedNotification ?? dto);
    }
  }

  async getNotifications(ctx: GraphQLContext, query: QueryInput) {
    const userId = ctx.request.userId!;
    const { notifications, totalCount } =
      await this.notificationRepo.getNotificationsByUserId(userId, query);

    const mappedNotifications = this.mapper.mapArray(
      notifications,
      MongoNotification,
      GraphQLNotification,
    );

    return { notifications: mappedNotifications, meta: { totalCount } };
  }

  async markAsRead(ctx: GraphQLContext, notificationId: string) {
    const userId = ctx.request.userId!;

    const notification =
      await this.notificationRepo.findNotificationByIdAndUserId(
        notificationId,
        userId,
      );
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.is_read = true;
    notification.read_at = new Date();

    await this.notificationRepo.saveNotification(notification);

    return this.mapper.map(
      notification,
      MongoNotification,
      GraphQLNotification,
    );
  }
}
