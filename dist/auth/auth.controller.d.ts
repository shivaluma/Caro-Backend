import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { AuthService } from './auth.service';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(authCredentialsDto: RegisterCredentialsDto): Promise<void>;
    signIn(authCredentialsDto: LoginCredentialsDto): Promise<{
        accessToken: string;
    }>;
    test(req: any): {
        message: string;
    };
    test2(req: any): {
        message: string;
    };
}
