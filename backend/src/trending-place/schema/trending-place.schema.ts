import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type TrendingPlaceDocument = TrendingPlace & Document;

@Schema({ timestamps: true })
export class TrendingPlace {
  @Prop({ type: [Types.ObjectId], ref: 'Place' })
  placeIds: Types.ObjectId[];
}

export const TrendingPlaceSchema = SchemaFactory.createForClass(TrendingPlace);
