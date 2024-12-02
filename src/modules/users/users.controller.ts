import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  HttpCode,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ValidationPipe } from '../../commons/pipes/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponse } from '@modules/users/response/user.response';
import { UserListResponse } from '@modules/users/response/userList.response';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um usuario',
  })
  @ApiResponse({
    status: 200,
    type: UserResponse,
  })
  createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retorna uma lista de usuarios com paginação',
  })
  @ApiResponse({
    status: 200,
    type: [UserListResponse],
  })
  async getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('keyword', new DefaultValuePipe('')) keyword: string,
  ) {
    return this.usersService.getUsers({ page, pageSize });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retorna um usuario pelo id',
  })
  @ApiResponse({
    status: 200,
    type: UserResponse,
  })
  async getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update de usuario por id',
  })
  @ApiResponse({
    status: 200,
    type: UserResponse,
  })
  updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({
    summary: 'Deleta usuario por id',
  })
  @ApiResponse({
    status: 204,
  })
  @HttpCode(204)
  async removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }
}
