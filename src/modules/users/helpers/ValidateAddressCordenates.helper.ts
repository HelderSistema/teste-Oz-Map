import { CreateUserDto, UpdateUserDto } from '@modules/users/dto';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidateAddressCordenatesHelper {
  static validarCordenadasAddress(data: CreateUserDto | UpdateUserDto) {
    if (data.address && data.coordinates) {
      throw new HttpException(
        'Não é permitido enviar address e cordenadas',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!data.address && !data.coordinates) {
      throw new HttpException(
        'É obrigatorio envio de address ou cordenadas',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
