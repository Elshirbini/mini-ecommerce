import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../notification.repository';
import { SendNotificationDto } from '../interfaces/notification-channel.interface';
import { Types } from 'mongoose';

@Injectable()
export class DatabaseChannel {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async send(dto: SendNotificationDto) {
    return this.notificationRepo.createNotification({
      userId: new Types.ObjectId(dto.userId),
      title: dto.title,
      body: dto.body,
      type: dto.type,
      data: dto.data,
      link: dto.link,
    });
  }
}
