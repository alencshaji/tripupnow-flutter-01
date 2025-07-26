import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrendingPlace, TrendingPlaceDocument } from './schema/trending-place.schema';
import { Model } from 'mongoose';

@Injectable()
export class TrendingPlaceService {
  constructor(
    @InjectModel(TrendingPlace.name)
    private trendingModel: Model<TrendingPlaceDocument>,
  ) {}

  async getTrendingPlaces() {
    const trending = await this.trendingModel
      .findOne()
      .populate('placeIds')
      .exec();

    return trending?.placeIds || [];
  }

  async setTrendingPlaces(placeIds: string[]) {
    return this.trendingModel.findOneAndUpdate(
      {},
      { placeIds },
      { new: true, upsert: true },
    );
  }
}
