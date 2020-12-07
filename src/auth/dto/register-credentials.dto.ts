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
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiProperty()
  @IsDefined()
  @Match('password')
  confirmPassword: string;
}
