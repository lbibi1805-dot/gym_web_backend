import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JWTPayload } from '../types/common.types';

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const secret = config.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
