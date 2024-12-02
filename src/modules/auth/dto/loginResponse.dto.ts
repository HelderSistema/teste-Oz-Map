import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({})
  access_token: string;
  @ApiProperty({})
  iat: number;
  @ApiProperty({})
  exp: number;
}
