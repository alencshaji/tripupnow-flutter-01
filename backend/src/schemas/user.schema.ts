import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Roles } from '../auth/dto/auth.dto';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {

  _id: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: null })
  verificationToken: string | null;

  @Prop()
  otp: string;


  @Prop({ default: Roles.USER })
  role: Roles;


  @Prop({ default: true, select: false })
  isActive: boolean;

  @Prop()
  refreshToken: string;


}

export const UserSchema = SchemaFactory.createForClass(User);
