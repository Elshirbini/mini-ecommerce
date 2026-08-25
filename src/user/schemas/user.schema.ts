import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { UserRole } from '../enums/userRole.enum';
import { AutoMap } from '@automapper/classes';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id!: Types.ObjectId;

  @Prop({ required: true })
  @AutoMap()
  name!: string;

  @Prop({ required: true, unique: true })
  @AutoMap()
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.USER })
  @AutoMap()
  role!: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
