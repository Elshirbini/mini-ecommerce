import { Injectable } from '@nestjs/common';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { QueryInput } from './graphql/query.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async createNotification(notificationData: Partial<Notification>) {
    return this.notificationModel.create(notificationData);
  }

  async getNotificationsByUserId(userId: string, query: QueryInput) {
    const filter: QueryFilter<QueryInput> = {
      userId: new Types.ObjectId(userId),
    };

    if (query.is_read) {
      filter.is_read = query.is_read;
    }

    const notifications = await this.notificationModel
      .find(filter)
      .limit(Number(query.limit) || 10)
      .sort({ createdAt: -1 });
    const totalCount = await this.notificationModel.countDocuments(filter);

    return { notifications, totalCount };
  }

  async findNotificationByIdAndUserId(notificationId: string, userId: string) {
    return this.notificationModel.findOne({
      _id: new Types.ObjectId(notificationId),
      userId: new Types.ObjectId(userId),
    });
  }

  async saveNotification(notification: NotificationDocument) {
    return notification.save();
  }
}
