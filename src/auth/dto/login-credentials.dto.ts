import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined } from 'class-validator';

export class LoginCredentialsDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  username: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  password: string;
}
