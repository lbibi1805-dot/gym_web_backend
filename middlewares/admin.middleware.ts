import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/common.types';
import { HttpResponse } from '../helpers/HttpResponse';
import { StatusCode } from '../enums/statusCode.enums';

/**
 * Middleware to check if the authenticated user is an admin
 */
export const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(StatusCode.UNAUTHORIZED).json(
            HttpResponse.unauthorized('Authentication required.')
        );
        return;
    }

    if (req.user.role !== 'admin') {
        res.status(StatusCode.FORBIDDEN).json(
            HttpResponse.forbidden('Admin access required.')
        );
        return;
    }

    next();
};
