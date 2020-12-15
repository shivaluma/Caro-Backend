import { BaseEntity } from 'typeorm';
export declare class User extends BaseEntity {
    id: number;
    username: string;
    password: string;
    role: 'admin' | 'user';
    avatar: string | null;
    points: number;
    winnum: number;
    drawnum: number;
    losenum: number;
    validatePassword(password: string): Promise<boolean>;
}
