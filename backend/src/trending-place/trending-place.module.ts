import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrendingPlaceController } from './trending-place.controller';
import { TrendingPlaceService } from './trending-place.service';
import { TrendingPlace, TrendingPlaceSchema } from './schema/trending-place.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrendingPlace.name, schema: TrendingPlaceSchema },
    ]),
  ],
  controllers: [TrendingPlaceController],
  providers: [TrendingPlaceService],
})
export class TrendingPlaceModule {}
