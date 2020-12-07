import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class UserController {
  constructor(private userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/me')
  @ApiResponse({ status: 200, type: User, description: 'All user info' })
  getMe(@Req() req): UserDto {
    return req.user;
  }
}
