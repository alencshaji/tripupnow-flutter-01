import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Document, HydratedDocument, Types } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({ timestamps: true })
export class RefreshToken {
  _id: string;


  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ required: true, trim: true })
  refreshToken: string;

  @Prop({ required: true, type: Date })
  expiresIn: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
