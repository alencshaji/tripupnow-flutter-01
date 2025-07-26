import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { AddPlaceDto, FindAllPlacesDto, PlanTripDto } from './dto/place.dto';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post()
  async create(@Body() addPlaceDto: AddPlaceDto) {
    return this.placeService.create(addPlaceDto);
  }

  @Get()
  async findAll(@Query() query: FindAllPlacesDto) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);

    return this.placeService.findAll({
      page,
      limit,
      district: query.district,
    });
  }

@Get('nearby')
async getNearbyPlaces(@Query('lat') lat: string, @Query('lon') lon: string) {
  const userLat = parseFloat(lat);
  const userLon = parseFloat(lon);

  // if (isNaN(userLat) || isNaN(userLon)) {
  //   throw new BadRequestException('Latitude and Longitude must be valid numbers.');
  // }

  return this.placeService.getNearbyPlaces(userLat, userLon);
}

  @Get('search')
  async searchPlaces(@Query('query') query: string) {
    return this.placeService.searchPlaces(query);
  }
    @Get('plans')
  async planTrip(@Body() data: PlanTripDto) {
    return this.placeService.planTrip(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.placeService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<AddPlaceDto>,
  ) {
    return this.placeService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.placeService.remove(id);
  }
}


