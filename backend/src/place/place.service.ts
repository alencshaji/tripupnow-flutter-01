import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place, PlaceDocument } from '../schemas/place.schema';
import { AddPlaceDto, PlanTripDto } from './dto/place.dto';

interface FindAllOptions {
  page: number;
  limit: number;
  district?: string;
}

@Injectable()
export class PlaceService {
  constructor(
    @InjectModel(Place.name) private placeModel: Model<PlaceDocument>,
  ) {}

  // ✅ Create a new place
  async create(addPlaceDto: AddPlaceDto): Promise<Place> {
    const existing = await this.placeModel.findOne({
      placeName: addPlaceDto.placeName,
    });
    if (existing) {
      throw new BadRequestException('Place with this name already exists.');
    }

    const newPlace = new this.placeModel(addPlaceDto);
    return newPlace.save();
  }
  // ✅ Get all places
  async findAll(options: FindAllOptions): Promise<{
    data: Place[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, district } = options;
    const filter: Record<string, any> = {};

    if (district) {
      filter.district = district;
    }

    const total = await this.placeModel.countDocuments(filter);
    const data = await this.placeModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      data,
      total,
      page,
      limit,
    };
  }
  // ✅ Get a single place by ID
  async findOne(id: string): Promise<Place> {
    const place = await this.placeModel.findById(id);
    if (!place) {
      throw new NotFoundException('Place not found.');
    }
    return place;
  }
  // ✅ Update a place
  async update(id: string, updateDto: Partial<AddPlaceDto>): Promise<Place> {
    const updated = await this.placeModel.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    if (!updated) {
      throw new NotFoundException('Place to update not found.');
    }
    return updated;
  }
  // ✅ Delete a place
  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.placeModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Place to delete not found.');
    }
    return { message: 'Place deleted successfully' };
  }
  // ✅ Search places
  async searchPlaces(query: string): Promise<Place[]> {
    const searchRegex = new RegExp(query, 'i');
    return this.placeModel
      .find({ placeName: { $regex: searchRegex } })
      .limit(10)
      .exec();
  }
  // ✅ get Nearby places
  async getNearbyPlaces(userLat: number, userLon: number): Promise<any[]> {
    const radiusLimit = 10;
    const buffer = 0.017 * radiusLimit;

    const places = await this.placeModel.find().exec();

    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const haversine = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number,
    ): number => {
      const R = 6371.0;
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c * 1.219;
    };

    const nearby = [];

    for (const place of places) {
      const lat = parseFloat(place.latitude as any);
      const lon = parseFloat(place.longitude as any);

      if (typeof lat !== 'number' || typeof lon !== 'number') continue;

      if (
        Math.abs(userLat - lat) <= buffer &&
        Math.abs(userLon - lon) <= buffer
      ) {
        const distance = haversine(userLat, userLon, lat, lon);
        if (distance <= radiusLimit) {
          nearby.push({
            ...place.toObject(),
            distance_km: +distance.toFixed(2),
            time_min: Math.ceil(distance * 1.7),
          });
        }
      }
    }

    return nearby.sort((a, b) => a.distance_km - b.distance_km);
  }
  // ✅ Trip Planner
async planTrip(dto: PlanTripDto): Promise<{ short: any[]; long: any[] }> {
  const {
    startLat,
    startLon,
    totalTimeAvailable,
    numberOfPlaces,
    visitTimePerPlace,
  } = dto;

  const avgSpeedKmph = 30;
  const maxDistanceKm = 10;
  const marginDeg = 0.017 * maxDistanceKm;
  const startLocation: [number, number] = [startLat, startLon];

  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const haversine = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371.0;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1.219;
  };

  const getNearestPlaces = (
    currentLocation: [number, number],
    places: any[],
    startLocation: [number, number] | null = null,
    boundaryKm: number | null = null,
  ): any[] => {
    const [lat1, lon1] = currentLocation;
    const filtered = [];

    for (const place of places) {
      const lat2 = parseFloat(place.latitude as any);
      const lon2 = parseFloat(place.longitude as any);
      if (isNaN(lat2) || isNaN(lon2)) continue;

      if (
        Math.abs(lat1 - lat2) > marginDeg ||
        Math.abs(lon1 - lon2) > marginDeg
      )
        continue;

      const dist = haversine(lat1, lon1, lat2, lon2);
      if (dist > maxDistanceKm) continue;

      if (boundaryKm && startLocation) {
        const boundaryDist = haversine(
          startLocation[0],
          startLocation[1],
          lat2,
          lon2,
        );
        if (boundaryDist > boundaryKm) continue;
      }

      filtered.push({
        ...place.toObject(),
        distance: dist,
        lat: lat2,
        lon: lon2,
      });
    }

    return filtered.sort(() => Math.random() - 0.5).sort((a, b) => a.distance - b.distance);
  };

  const planRoute = (
    allPlaces: any[],
    bounded: boolean,
  ): { result: any[]; timeUsed: number } => {
    const visited = new Set<string>();
    let timeUsed = 0;
    let currentLocation: [number, number] = [...startLocation];
    const route = [];

    for (let i = 0; i < numberOfPlaces; i++) {
      const nearby = getNearestPlaces(
        currentLocation,
        allPlaces,
        bounded ? startLocation : null,
        bounded ? 30 : null,
      );

      let found = false;
      for (const place of nearby) {
        const travelTime = place.distance / avgSpeedKmph;
        const totalTime = travelTime + visitTimePerPlace;

        if (
          !visited.has(place.placeName) &&
          timeUsed + totalTime <= totalTimeAvailable
        ) {
          visited.add(place.placeName);
          route.push({
            ...place,
            distanceKm: +place.distance.toFixed(2),
            travelTimeMin: Math.ceil(travelTime * 60),
          });
          timeUsed += totalTime;
          currentLocation = [place.lat, place.lon];
          found = true;
          break;
        }
      }
      if (!found) break;
    }

    return { result: route, timeUsed };
  };

  const allPlaces = await this.placeModel.find().exec();
  const planUnbounded = planRoute(allPlaces, false);
  const planBounded = planRoute(allPlaces, true);

  return {
    long: planUnbounded.result, // unbounded plan
    short: planBounded.result,  // bounded within 30km plan
  };
}

}
