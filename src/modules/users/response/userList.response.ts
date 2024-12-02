import { User } from '@modules/users/model/User';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from '@modules/users/response/user.response';

export class UserListResponse {
  @ApiProperty()
  count: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  total: number;

  @ApiProperty({
    type: [UserResponse],
  })
  items: UserResponse[];

  static fromUserListEntityList(entities: User[]): UserResponse[] {
    return entities.map((entity) => {
      return UserResponse.fromUserEntity(entity);
    });
  }
}
