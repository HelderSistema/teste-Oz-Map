import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPagination } from 'src/types/global';
import { CreateRegionDto, UpdateRegionDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Region } from '@modules/regions/model/Region';
import { RegionResponse } from '@modules/regions/response/region.response';
import { RegionListResponse } from '@modules/regions/response/regionList.response';
import { ValidateCoordinatesHelper } from '@modules/regions/Helper/ValidateCoordinates.helper';
import { UsersService } from '@modules/users/users.service';
import { GeoService } from '@modules/geo/geo.service';
import { GetRegionsPointDto } from '@modules/regions/dto/get-regions-point.dto';
import { GetRegionsPointDistanceDto } from '@modules/regions/dto/get-regions-point-distance.dto';

@Injectable()
export class RegionsService {
  constructor(
    @InjectModel(Region.name) private readonly regionModel: Model<Region>,
    private readonly usersService: UsersService,
    private readonly geoService: GeoService,
  ) {}

  async createRegion(data: CreateRegionDto) {
    ValidateCoordinatesHelper.validateCoordinates(data.coordinates);

    const user = await this.usersService.getUser(data.user);

    if (!user) {
      throw new HttpException(
        `User with id '${data.user}' was not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    let newRegion = new this.regionModel(data);

    await newRegion.save();

    newRegion = await newRegion.populate('user');

    return RegionResponse.fromRegionEntity(newRegion);
  }

  async getRegions(pagination: IPagination) {
    const filter = {};

    const itemsPromise = this.regionModel
      .find(filter)
      .sort({ updatedAt: -1 })
      .skip((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize)
      .populate('user')
      .exec();

    const totalPromise = this.regionModel.countDocuments(filter).exec();

    const [items, total] = await Promise.all([itemsPromise, totalPromise]);

    const itemsResponse = RegionListResponse.fromRegionEntityList(items);

    return {
      items: itemsResponse,
      count: itemsResponse.length,
      totalPages: Math.ceil(total / pagination.pageSize),
      total,
    };
  }

  async getRegion(id: string) {
    const region = await this.regionModel.findById(id).populate('user').exec();

    if (!region) {
      throw new HttpException(
        `Region with id '${id}' was not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return RegionResponse.fromRegionEntity(region);
  }

  async updateRegion(id: string, data: UpdateRegionDto) {
    ValidateCoordinatesHelper.validateCoordinates(data.coordinates);

    const user = await this.usersService.getUser(data.user);

    if (!user) {
      throw new HttpException(
        `Region with id '${id}' was not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const oldRegion = await this.getRegion(id);

    const updateData: Partial<UpdateRegionDto> = {
      name: data.name || oldRegion.name,
      coordinates: data.coordinates || oldRegion.coordinates,
      user: data.user,
    };

    const updatedRegion = await this.regionModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .populate('user')
      .exec();

    if (!updatedRegion) {
      throw new HttpException(
        `Region with id '${id}' was not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return RegionResponse.fromRegionEntity(updatedRegion);
  }

  async removeRegion(id: string) {
    const region = await this.getRegion(id);

    if (!region) {
      throw new HttpException(
        `Region which '${id}' was not exist`,
        HttpStatus.FORBIDDEN,
      );
    }
    await this.regionModel.findByIdAndDelete(id).exec();

    return `Region with id '${id}' has been removed successfully.`;
  }

  async getRegionsPoint(data: GetRegionsPointDto) {
    const filter = {};

    const itemsPromise = await this.regionModel
      .find(filter)
      .sort({ updatedAt: -1 })
      .populate('user')
      .exec();

    const items = RegionListResponse.fromRegionEntityList(itemsPromise);

    const regionsInPoint = [];

    const point: [number, number] = data.point.split(',').map(Number) as [
      number,
      number,
    ];
    for (const item of items) {
      const region = {
        type: 'Polygon',
        coordinates: [item.coordinates],
      };

      if (
        this.geoService.isPointInsidePolygon(
          // [-46.955045272818694, -22.429182742532248],
          point,
          region,
        )
      ) {
        regionsInPoint.push(item);
      }
    }

    return {
      items: regionsInPoint,
      count: regionsInPoint.length,
    };
  }

  async getRegionsPointDistance(data: GetRegionsPointDistanceDto) {
    const filter = {};

    const itemsPromise = await this.regionModel
      .find(filter)
      .sort({ updatedAt: -1 })
      .populate('user')
      .exec();

    const items = RegionListResponse.fromRegionEntityList(itemsPromise);

    const regionsReturn = [];

    const point: [number, number] = data.point.split(',').map(Number) as [
      number,
      number,
    ];
    for (const item of items) {
      const region = {
        type: 'Polygon',
        coordinates: [item.coordinates],
      };

      const pointDistance = this.geoService.calculateDistanceToPolygonInMeters(
        point,
        region,
      );
      if (pointDistance < parseFloat(data.limit)) {
        regionsReturn.push(item);
      }
    }

    return {
      items: regionsReturn,
      count: regionsReturn.length,
    };
  }
}
