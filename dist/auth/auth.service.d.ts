import { UserRepository } from '../user/user.repository';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import TokenPayload from './token-payload.interface';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: UserRepository, jwtService: JwtService);
    signUp(authCredentialsDto: RegisterCredentialsDto): Promise<void>;
    signIn(authCredentialsDto: LoginCredentialsDto, role?: 'user' | 'admin'): Promise<{
        payload: TokenPayload;
        accessToken: string;
    }>;
}
