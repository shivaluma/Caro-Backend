import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterCredentialsDto } from '../auth/dto/register-credentials.dto';
import { LoginCredentialsDto } from '../auth/dto/login-credentials.dto';
import TokenPayload from '../auth/token-payload.interface';
export declare class UserRepository extends Repository<User> {
    signUp(authCredentialsDTO: RegisterCredentialsDto): Promise<void>;
    validateUserPassword(authCredentialsDto: LoginCredentialsDto): Promise<TokenPayload>;
}
