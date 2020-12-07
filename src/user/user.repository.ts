import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterCredentialsDto } from '../auth/dto/register-credentials.dto';
import { LoginCredentialsDto } from '../auth/dto/login-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import TokenPayload from '../auth/token-payload.interface';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDTO: RegisterCredentialsDto): Promise<void> {
    const { username, password, confirmPassword } = authCredentialsDTO;

    if (password !== confirmPassword) {
      throw new ConflictException('Password and confirmPassword is not match');
    }

    const user = new User();
    user.username = username;
    user.password = await argon2.hash(password);

    try {
      await user.save();
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: LoginCredentialsDto,
  ): Promise<TokenPayload> {
    console.log(authCredentialsDto);
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return { id: user.id, username: user.username, role: user.role };
    } else {
      return null;
    }
  }
}
