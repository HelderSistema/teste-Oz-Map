import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetRegionsPointDistanceDto {
  @ApiProperty() //-46.955045272818694, -22.429182742532248
  @IsNotEmpty()
  point: string;

  @ApiProperty()
  @IsNotEmpty()
  limit: string;
}
