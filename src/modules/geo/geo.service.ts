import { Injectable } from '@nestjs/common';
import * as turf from '@turf/turf';

@Injectable()
export class GeoService {
  isPointInsidePolygon(point: [number, number], polygon: any): boolean {
    const pointGeoJSON = turf.point(point);
    const polygonGeoJSON = turf.polygon(polygon.coordinates);
    return turf.booleanPointInPolygon(pointGeoJSON, polygonGeoJSON);
  }

  calculateDistanceToPolygonInMeters(
    point: [number, number],
    polygon: any,
  ): number {
    const pointGeoJSON = turf.point(point);
    const polygonGeoJSON = turf.polygon(polygon.coordinates);

    const polygonEdges = turf.polygonToLine(polygonGeoJSON);

    // @ts-ignore
    return turf.pointToLineDistance(pointGeoJSON, polygonEdges, {
      units: 'meters',
    });
  }
}
