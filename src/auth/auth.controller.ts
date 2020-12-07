import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/utils/role.decorator';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: RegisterCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: LoginCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
  @ApiBearerAuth()
  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    return { message: 'Normal route, all roles can get' };
  }
  @ApiBearerAuth()
  @Post('/test2')
  @UseGuards(AuthGuard())
  @Roles('admin')
  test2(@Req() req) {
    return { message: 'Admin route' };
  }
}
