import { User } from '@modules/users/model/User';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty()
  id?: string;
  @ApiProperty()
  name?: string;
  @ApiProperty()
  email?: string;
  @ApiProperty()
  password?: string;
  @ApiProperty()
  createdAt?: string;
  @ApiProperty()
  updatedAt?: string;

  static fromUserEntity(entity: User): UserResponse {
    const response = new UserResponse();
    response.id = entity._id;
    response.name = entity.name;
    response.email = entity.email;
    response.createdAt = entity.createdAt?.toString();
    response.updatedAt = entity.updatedAt?.toString();

    return response;
  }
}
