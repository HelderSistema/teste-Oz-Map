import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty()
  @IsNotEmpty()
  name?: string;

  @ApiProperty()
  @IsNotEmpty()
  coordinates: any; //validado em helper

  @ApiProperty()
  @IsNotEmpty()
  user: string;
}
