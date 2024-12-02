import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRegionDto {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  coordinates: any; //validado em helper

  @ApiProperty()
  @IsNotEmpty()
  user: string;
}
