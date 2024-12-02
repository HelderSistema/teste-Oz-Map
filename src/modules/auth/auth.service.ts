import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { UsersService } from '@modules/users/users.service';
import { UserResponse } from '@modules/users/response/user.response';
import { encrypt } from '@utils/encrypt';
import { LoginResponseDto } from '@modules/auth/dto/loginResponse.dto'; // Serviço do módulo de usuários

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(login: LoginDto): Promise<any> {
    const user = await this.usersService.getByEmail(login.email);
    if (user && this.comparePassword(login.password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }

  async login(user: UserResponse): Promise<LoginResponseDto> {
    const payload = { username: user.email, sub: user.id };

    const access_token = this.jwtService.sign(payload);

    const decoded = this.jwtService.decode(access_token) as {
      iat: number;
      exp: number;
    };

    return {
      access_token: access_token,
      iat: decoded.iat * 1000,
      exp: decoded.exp * 1000,
    };
  }

  comparePassword(password, passwordEncrypt) {
    const encryptedPassword = encrypt(password);
    return encryptedPassword === passwordEncrypt;
  }
}
