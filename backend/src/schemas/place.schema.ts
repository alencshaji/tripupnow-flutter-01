import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlaceDocument = HydratedDocument<Place>

@Schema({ timestamps: true })
export class Place {

  @Prop({ type: String, required: true })
  placeName: string;

  @Prop({ type: String, })
  description: string;

  @Prop({ type: String, })
  titleImage: string;

  @Prop({ type: String, })
  optionalImage1: string;

  @Prop({ type: String, })
  optionalImage2: string;

  @Prop({ type: String, })
  latitude: string;

  @Prop({ type: String, })
  longitude: string;

  @Prop({ type: String, })
  highlights: string;

  @Prop({ type: String, })
  tags: string;

  @Prop({ type: String, })
  timeToVisit: string;

  @Prop({ type: String, })
  state: string;

  @Prop({ type: String, })
  gmap: string;

  @Prop({ type: String, })
  district: string;

  @Prop({ type: String, })
  category: string;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
