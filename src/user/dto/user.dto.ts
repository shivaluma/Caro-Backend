import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

export class UserDto {
  @ApiProperty()
  username: string;

  @Exclude()
  password: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  role: 'admin' | 'user';

  @ApiProperty()
  points: number;

  @ApiProperty()
  winnum: number;

  @ApiProperty()
  drawnum: number;
  @ApiProperty()
  losenum: number;
}
