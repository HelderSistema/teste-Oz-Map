/* eslint-disable quotes */
import { Test, TestingModule } from '@nestjs/testing';
import { RegionsService } from './regions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Region } from './model/Region';
import { UsersService } from '../users/users.service';
import { GeoService } from '../geo/geo.service';
import { CreateRegionDto, UpdateRegionDto } from './dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('RegionsService', () => {
  let regionsService: RegionsService;
  let regionModel: any;
  let usersService: any;
  let geoService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegionsService,
        {
          provide: getModelToken(Region.name),
          useValue: {
            findOne: jest.fn(),
            findById: jest.fn(),
            find: jest.fn(),
            countDocuments: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getUser: jest.fn(),
          },
        },
        {
          provide: GeoService,
          useValue: {
            isPointInsidePolygon: jest.fn(),
            calculateDistanceToPolygonInMeters: jest.fn(),
          },
        },
      ],
    }).compile();

    regionsService = module.get<RegionsService>(RegionsService);
    regionModel = module.get(getModelToken(Region.name));
    usersService = module.get<UsersService>(UsersService);
    geoService = module.get<GeoService>(GeoService);
  });

  describe('createRegion', () => {
    it('should throw an error if user does not exist', async () => {
      const data: CreateRegionDto = {
        user: 'nonexistentUser',
        coordinates: [
          [0, 0],
          [0, 0],
        ],
      };
      usersService.getUser.mockResolvedValue(null);

      await expect(regionsService.createRegion(data)).rejects.toThrow(
        new HttpException(
          `User with id '${data.user}' was not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('getRegions', () => {
    it('should return a paginated list of regions', async () => {
      const pagination = { page: 1, pageSize: 10 };
      const regions = [{ coordinates: [[0, 0]], user: 'user1' }];
      regionModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(regions),
              }),
            }),
          }),
        }),
      });
      regionModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(regions.length),
      });

      const result = await regionsService.getRegions(pagination);
      expect(result.items.length).toBe(regions.length);
      expect(result.total).toBe(regions.length);
    });
  });

  describe('getRegion', () => {
    it('should return a region if found', async () => {
      const region = { coordinates: [[0, 0]], user: {} };
      regionModel.findById.mockReturnValue({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(region) }),
      });

      const result = await regionsService.getRegion('someId');
      expect(result).toEqual(region);
    });

    it('should throw an error if region not found', async () => {
      regionModel.findById.mockReturnValue({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      });

      await expect(regionsService.getRegion('someId')).rejects.toThrow(
        new HttpException(
          `Region with id 'someId' was not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('updateRegion', () => {
    it('should update and return the region', async () => {
      const region = { coordinates: [[0, 0]], user: {} };
      regionModel.findById.mockReturnValue({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(region) }),
      });
      usersService.getUser.mockResolvedValue({ id: 'user1' });
      regionModel.findByIdAndUpdate.mockReturnValue({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(region) }),
      });

      const updateData: UpdateRegionDto = {
        name: 'Updated Region',
        coordinates: [
          [1, 1],
          [2, 2],
        ],
        user: 'user1',
      };
      const result = await regionsService.updateRegion('someId', updateData);
      expect(result).toEqual(region);
    });

    it('should throw an error if region not found during update', async () => {
      regionModel.findById.mockReturnValue({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      });

      await expect(
        regionsService.updateRegion('someId', {
          coordinates: [
            [1, 1],
            [2, 2],
          ],
          name: 'Helder',
        } as UpdateRegionDto),
      ).rejects.toThrow(
        new HttpException(
          `Region with id 'someId' was not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('removeRegion', () => {
    it('should remove the region', async () => {
      const region = { coordinates: [[0, 0]], user: 'user1' };
      regionModel.findById.mockReturnValue({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(region) }),
      });
      regionModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(region),
      });

      const result = await regionsService.removeRegion('someId');
      expect(result).toBe(
        `Region with id 'someId' has been removed successfully.`,
      );
    });

    it('should throw an error if region not found during remove', async () => {
      regionModel.findById.mockReturnValue({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      });

      await expect(regionsService.removeRegion('someId')).rejects.toThrow(
        new HttpException(
          `Region with id 'someId' was not found`,
          HttpStatus.FORBIDDEN,
        ),
      );
    });
  });

  describe('getRegionsPoint', () => {
    it('should return regions containing the point', async () => {
      const regions = [{ coordinates: [[0, 0]], user: 'user1' }];
      regionModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest
            .fn()
            .mockReturnValue({ exec: jest.fn().mockResolvedValue(regions) }),
        }),
      });
      geoService.isPointInsidePolygon.mockReturnValue(true);

      const data = { point: '0,0' };
      const result = await regionsService.getRegionsPoint(data);
      expect(result.items.length).toBe(1);
    });
  });

  describe('getRegionsPointDistance', () => {
    it('should return regions within the specified distance', async () => {
      const regions = [{ coordinates: [[0, 0]], user: 'user1' }];
      regionModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest
            .fn()
            .mockReturnValue({ exec: jest.fn().mockResolvedValue(regions) }),
        }),
      });
      geoService.calculateDistanceToPolygonInMeters.mockReturnValue(5);

      const data = { point: '0,0', limit: '10' };
      const result = await regionsService.getRegionsPointDistance(data);
      expect(result.items.length).toBe(1);
    });
  });
});
