import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsCoordinates } from '@modules/users/dto/is-coordinates.validator';

export class UpdateUserDto {
  @ApiProperty({
    description: '用户昵称',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: '登录密码',
    required: false,
  })
  password?: string;

  @ApiProperty()
  @IsOptional()
  address?: string;

  @IsOptional()
  @IsCoordinates({
    message: 'Coordenadas inválidas. Use o formato [latitude, longitude]',
  })
  coordinates?: [number, number];
}
