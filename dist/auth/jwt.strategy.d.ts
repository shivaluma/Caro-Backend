import TokenPayload from './token-payload.interface';
import { UserRepository } from '../user/user.repository';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userRepository;
    constructor(userRepository: UserRepository);
    validate(payload: TokenPayload): Promise<import("../user/user.entity").User>;
}
export {};
