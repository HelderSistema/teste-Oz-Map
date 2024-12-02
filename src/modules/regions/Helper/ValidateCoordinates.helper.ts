import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidateCoordinatesHelper {
  static validateCoordinates(coordinates: any): void {
    if (!Array.isArray(coordinates)) {
      throw new HttpException(
        'Coordinates must be an array.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (coordinates.length < 2) {
      throw new HttpException(
        'Coordinates array must have at least 2 items.',
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const item of coordinates) {
      if (
        !Array.isArray(item) || // Cada item deve ser um array
        item.length !== 2 || // O array deve ter exatamente 2 elementos
        typeof item[0] !== 'number' || // O primeiro elemento deve ser um número
        typeof item[1] !== 'number' // O segundo elemento deve ser um número
      ) {
        throw new HttpException(
          'Each coordinate must be an array of two numbers.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
