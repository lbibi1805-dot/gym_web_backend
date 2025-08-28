import { Request } from 'express';

/**
 * Extended Request interface with authenticated user information
 */
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: 'client' | 'admin';
        status: 'pending' | 'approved' | 'rejected';
    };
}

/**
 * JWT Payload interface for token generation and verification
 */
export interface JWTPayload {
    id: string;
    email: string;
    role: 'client' | 'admin';
    status: 'pending' | 'approved' | 'rejected';
    iat?: number;
    exp?: number;
}
