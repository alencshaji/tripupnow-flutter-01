import { IsArray, IsMongoId } from 'class-validator';

export class CreateTrendingPlaceDto {
  @IsArray()
  @IsMongoId({ each: true })
  placeIds: string[];
}
