import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '@modules/users/dto';
import { GeocodeAddressService } from '@modules/Integrations/GeocodeAddress/GeocodeAddress.service';

export class GetAddresssOrCordenatesHelper {
  static async getAddresssOrCordenates(
    data: CreateUserDto | UpdateUserDto,
    geocodeAddressService: GeocodeAddressService,
  ): Promise<CreateUserDto | UpdateUserDto> {
    if (data.coordinates) {
      try {
        data.address = await geocodeAddressService.getAddress(
          data.coordinates[0],
          data.coordinates[1],
        );
      } catch {
        throw new HttpException(
          'Address was not found to this coordinates',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (data.address) {
      try {
        const coordinates = await geocodeAddressService.getCoordinates(
          data.address,
        );
        data.coordinates = [coordinates.latitude, coordinates.longitude];
      } catch {
        throw new HttpException(
          'Coordinates was not found to this address',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    return data;
  }
}
