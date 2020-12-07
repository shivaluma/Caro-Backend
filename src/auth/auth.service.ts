import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import TokenPayload from './token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: RegisterCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: LoginCredentialsDto,
  ): Promise<{ payload: TokenPayload; accessToken: string }> {
    const payload = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!payload) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.sign(payload);

    return { payload, accessToken };
  }
}
