import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';

export interface JWTPayload {
    id: string;
    email: string;
    role: string;
}

export const generateJWT = (payload: JWTPayload): string => {
    const secret = config.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    
    const options: SignOptions = {
        expiresIn: (config.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
    };
    
    return jwt.sign(payload, secret, options);
};

export const verifyJWT = (token: string): JWTPayload => {
    const secret = config.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    
    return jwt.verify(token, secret) as JWTPayload;
};
