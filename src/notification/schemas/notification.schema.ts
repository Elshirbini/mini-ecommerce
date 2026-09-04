import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @AutoMap()
  _id!: Types.ObjectId;

  @AutoMap()
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId!: Types.ObjectId;

  @AutoMap()
  @Prop({
    type: String,
    required: true,
  })
  title!: string;

  @AutoMap()
  @Prop({
    type: String,
    required: true,
  })
  body!: string;

  @AutoMap()
  @Prop({ type: Object })
  data?: Record<string, any>;

  @AutoMap()
  @Prop({ type: String, required: true })
  type!: string;

  @AutoMap()
  @Prop()
  link?: string;

  @AutoMap()
  @Prop({
    type: Boolean,
    default: false,
  })
  is_read!: boolean;

  @AutoMap()
  @Prop({ type: Date })
  read_at?: Date;

  @AutoMap()
  createdAt!: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
