import { ApiProperty } from '@nestjs/swagger';
import { Region } from '@modules/regions/model/Region';
import { RegionCoordinateDto } from '@modules/regions/dto/region.coordinate.dto';
import { UserResponse } from '@modules/users/response/user.response';
import { User } from '@modules/users/model/User';

export class RegionResponse {
  @ApiProperty()
  id?: string;
  @ApiProperty()
  name?: string;
  @ApiProperty()
  coordinates?: RegionCoordinateDto[][];
  @ApiProperty()
  user?: UserResponse;

  static fromRegionEntity(entity: Region): RegionResponse {
    const response = new RegionResponse();
    response.id = entity._id;
    response.name = entity.name;
    response.coordinates = entity.coordinates;
    response.user = UserResponse.fromUserEntity(entity.user as User);

    return response;
  }
}
