import { AuthService } from 'src/auth/auth.service';
import { LoginCredentialsDto } from 'src/auth/dto/login-credentials.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(authCredentialsDto: LoginCredentialsDto): Promise<{
        accessToken: string;
    }>;
}
