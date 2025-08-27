import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JWTPayload } from '../types/common.types';

// Load environment variables
dotenv.config();

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    console.log('🔍 Decoding token with JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('🚨 JWT_SECRET is not defined');
      throw new Error('JWT_SECRET is not defined');
    }
    
    const decoded = jwt.verify(token, secret) as JWTPayload;
    console.log('✅ Token decoded successfully:', decoded);
    return decoded;
  } catch (error) {
    console.error('🚨 Error decoding token:', error);
    return null;
  }
};
