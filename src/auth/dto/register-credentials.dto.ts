import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
} from 'class-validator';
import { Match } from 'src/utils/match.decorator';

export class RegisterCredentialsDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak.',
  })
  password: string;

  @ApiProperty()
  @IsDefined()
  @Match('password')
  confirmPassword: string;
}
