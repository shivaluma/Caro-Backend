import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  getMe(user: UserDto): UserDto {
    return user;
  }
}
