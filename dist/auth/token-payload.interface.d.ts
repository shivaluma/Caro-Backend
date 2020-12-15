interface TokenPayload {
    id: number;
    username: string;
    role: 'user' | 'admin';
}
export default TokenPayload;
