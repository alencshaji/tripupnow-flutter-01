import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class AddPlaceDto {
  @IsString()
  placeName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  titleImage: string;

  @IsOptional()
  @IsString()
  optionalImage1?: string;

  @IsOptional()
  @IsString()
  optionalImage2?: string;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @IsOptional()
  @IsString()
  highlights?: string;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsString()
  gmap?: string;

  @IsOptional()
  @IsString()
  timeToVisit?: string;

  @IsString()
  state: string;

  @IsString()
  district: string;

  @IsString()
  category: string;
}

export class FindAllPlacesDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  district?: string;
}

export class PlanTripDto {

   @IsString()
  startLat: number;

  
  startLon: number;
  totalTimeAvailable: number; // in hours
  numberOfPlaces: number;
  visitTimePerPlace: number; // in hours
  bounded?: boolean;
}
