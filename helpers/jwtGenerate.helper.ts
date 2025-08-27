import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JWTPayload } from '../types/common.types';

// Load environment variables
dotenv.config();

export const generateJWT = (payload: JWTPayload): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    
    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
    };
    
    return jwt.sign(payload, secret, options);
};

export const verifyJWT = (token: string): JWTPayload => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    
    return jwt.verify(token, secret) as JWTPayload;
};
