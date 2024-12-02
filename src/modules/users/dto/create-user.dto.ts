import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsCoordinates } from '@modules/users/dto/is-coordinates.validator';

export class CreateUserDto {
  @ApiProperty({})
  @IsNotEmpty()
  name: string;

  @ApiProperty({})
  @IsNotEmpty()
  email: string;

  @ApiProperty({})
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsOptional()
  address?: string;

  @IsOptional()
  @IsCoordinates({
    message: 'Coordenadas inválidas. Use o formato [latitude, longitude]',
  })
  coordinates?: [number, number];
  //
  // @ApiProperty({
  //   description: '用户昵称',
  // })
  // @IsNotEmpty()
  // regions: string;
}
