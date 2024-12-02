import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationPipe } from '../../commons/pipes/validation.pipe';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponse } from '@modules/users/response/user.response';
import { LoginResponseDto } from '@modules/auth/dto/loginResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Post()
  @ApiOperation({
    summary: 'Rota para login de usuário',
  })
  @ApiResponse({
    status: 200,
    type: LoginResponseDto,
  })
  async login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    return this.authService.login(user);
  }
}
