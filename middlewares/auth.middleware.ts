import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/common.types';
import { decodeToken } from '../helpers/decodeToken';
import { HttpResponse } from '../helpers/HttpResponse';
import { StatusCode } from '../enums/statusCode.enums';

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(StatusCode.UNAUTHORIZED).json(
        HttpResponse.unauthorized('Access denied. No token provided.')
        );
        return;
    }

    try {
        const decoded = decodeToken(token);
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
        res.status(StatusCode.UNAUTHORIZED).json(
        HttpResponse.unauthorized('Invalid token.')
        );
    }
};

export default authMiddleware;
