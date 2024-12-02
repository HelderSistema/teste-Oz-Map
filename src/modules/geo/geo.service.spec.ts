import { Test, TestingModule } from '@nestjs/testing';
import { GeoService } from './geo.service';

describe('GeoService', () => {
  let geoService: GeoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeoService],
    }).compile();

    geoService = module.get<GeoService>(GeoService);
  });

  describe('isPointInsidePolygon', () => {
    it('should return true if the point is inside the polygon', () => {
      const point: [number, number] = [2, 2];
      const polygon = {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [0, 5],
            [5, 5],
            [5, 0],
            [0, 0],
          ],
        ],
      };

      const result = geoService.isPointInsidePolygon(point, polygon);
      expect(result).toBe(true);
    });

    it('should return false if the point is outside the polygon', () => {
      const point: [number, number] = [6, 6];
      const polygon = {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [0, 5],
            [5, 5],
            [5, 0],
            [0, 0],
          ],
        ],
      };

      const result = geoService.isPointInsidePolygon(point, polygon);
      expect(result).toBe(false);
    });
  });

  describe('calculateDistanceToPolygonInMeters', () => {
    it('should calculate the distance to the nearest edge of the polygon', () => {
      const point: [number, number] = [6, 6];
      const polygon = {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [0, 5],
            [5, 5],
            [5, 0],
            [0, 0],
          ],
        ],
      };

      const distance = geoService.calculateDistanceToPolygonInMeters(
        point,
        polygon,
      );
      expect(distance).toBeGreaterThan(0);
    });

    it('should return 0 if the point is inside the polygon', () => {
      const point: [number, number] = [2, 2];
      const polygon = {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [0, 5],
            [5, 5],
            [5, 0],
            [0, 0],
          ],
        ],
      };

      const distance = geoService.calculateDistanceToPolygonInMeters(
        point,
        polygon,
      );
      expect(distance).toBe(222254.67264506358);
    });
  });
});
