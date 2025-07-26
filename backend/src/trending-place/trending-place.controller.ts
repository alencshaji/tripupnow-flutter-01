import { Body, Controller, Get, Post } from '@nestjs/common';
import { TrendingPlaceService } from './trending-place.service';
import { CreateTrendingPlaceDto } from './dto/create-trending-place.dto';

@Controller('trending')
export class TrendingPlaceController {
  constructor(private readonly trendingService: TrendingPlaceService) {}

  @Get()
  async getTrending() {
    return this.trendingService.getTrendingPlaces();
  }

  @Post()
  async setTrending(@Body() dto: CreateTrendingPlaceDto) {
    return this.trendingService.setTrendingPlaces(dto.placeIds);
  }
}
