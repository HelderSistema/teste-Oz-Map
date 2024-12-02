import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from '@modules/users/response/user.response';

class GetRegionsPointDistanceResponseDto {
  @ApiProperty({ example: '674509e02d7d17f1557700dd' })
  id: string;

  @ApiProperty({ example: 'helder 2' })
  name: string;

  @ApiProperty({ example: 'helder.2@gmail.com' })
  email: string;

  @ApiProperty({
    example: 'Mon Nov 25 2024 20:36:00 GMT-0300 (Horário Padrão de Brasília)',
  })
  createdAt: string;

  @ApiProperty({
    example: 'Tue Nov 26 2024 21:06:44 GMT-0300 (Horário Padrão de Brasília)',
  })
  updatedAt: string;
}

class CoordinatesDto {
  @ApiProperty({ example: -46.95607483941052 })
  longitude: number;

  @ApiProperty({ example: -22.428395983079866 })
  latitude: number;
}

class ItemDto {
  @ApiProperty({ example: '6748d76a975413297d5a18a5' })
  id: string;

  @ApiProperty({ example: 'Casa Ipanema Helder' })
  name: string;

  @ApiProperty({
    type: [CoordinatesDto],
    isArray: true,
    description: 'Lista de coordenadas que formam a área.',
  })
  coordinates: number[][];

  @ApiProperty({ type: UserResponse })
  user: UserResponse;
}

export class ApiResponseRegionPointDto {
  @ApiProperty({ type: [ItemDto] })
  items: ItemDto[];

  @ApiProperty({ example: 1 })
  count: number;
}
