import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from '@modules/users/response/user.response';
import { RegionResponse } from '@modules/regions/response/region.response';
import { Region } from '@modules/regions/model/Region';

export class RegionListResponse {
  @ApiProperty()
  count: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  total: number;

  @ApiProperty({
    type: [UserResponse],
  })
  items: RegionResponse[];

  static fromRegionEntityList(entities: Region[]): RegionResponse[] {
    return entities.map((entity) => {
      return RegionResponse.fromRegionEntity(entity);
    });
  }
}
