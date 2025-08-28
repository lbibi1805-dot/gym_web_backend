import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/common.types';
import { decodeToken } from '../helpers/decodeToken';
import { HttpResponse } from '../helpers/HttpResponse';
import { StatusCode } from '../enums/statusCode.enums';

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.header('Authorization');
    console.log('🔍 Auth Header:', JSON.stringify(authHeader));
    
    // Handle multiple spaces and trim properly
    const token = authHeader?.replace(/Bearer\s+/, '').trim();
    console.log('🔍 Extracted Token Length:', token?.length);
    console.log('🔍 Extracted Token:', token?.substring(0, 50) + '...');
    console.log('🔍 Token starts with:', token?.substring(0, 10));

    if (!token) {
        res.status(StatusCode.UNAUTHORIZED).json(
        HttpResponse.unauthorized('Access denied. No token provided.')
        );
        return;
    }

    try {
        const decoded = decodeToken(token);
        console.log('🔍 Decoded Token:', decoded);
        
        if (!decoded) {
        res.status(StatusCode.UNAUTHORIZED).json(
            HttpResponse.unauthorized('Invalid token.')
        );
        return;
        }

        req.user = decoded;
        next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        console.error('🚨 Token Error:', error);
        res.status(StatusCode.UNAUTHORIZED).json(
        HttpResponse.unauthorized('Invalid token.')
        );
    }
};

export default authMiddleware;
