import { NotificationChannel } from '../enums/notification.enums';

export interface SendNotificationDto {
  userId: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, any>;
  link?: string;
  channels: NotificationChannel[];
  /** Used by WhatsAppChannel as the template's sender-name variable. */
  senderName?: string;
}
