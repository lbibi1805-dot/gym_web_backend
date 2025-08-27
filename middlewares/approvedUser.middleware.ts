import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/common.types';
import { HttpResponse } from '../helpers/HttpResponse';
import { StatusCode } from '../enums/statusCode.enums';
import { UserModel } from '../models/user.models';
import { validateUserApproved } from '../helpers/userValidation.helper';

/**
 * Middleware to check if the authenticated user is approved
 */
export const approvedUserMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
        res.status(StatusCode.UNAUTHORIZED).json(
            HttpResponse.unauthorized('Authentication required.')
        );
        return;
    }

    try {
        const user = await UserModel.findById(req.user.id);
        
        if (!user) {
            res.status(StatusCode.NOT_FOUND).json(
                HttpResponse.notFound('User not found.')
            );
            return;
        }

        try {
            validateUserApproved(user);
            next();
        } catch (validationError: unknown) {
            if (validationError && typeof validationError === 'object' && 'statusCode' in validationError && 'message' in validationError) {
                res.status((validationError as { statusCode: number }).statusCode).json(
                    HttpResponse.forbidden((validationError as { message: string }).message)
                );
            } else {
                res.status(StatusCode.FORBIDDEN).json(
                    HttpResponse.forbidden('Access denied')
                );
            }
        }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
            HttpResponse.internalServerError('Error checking user approval status.')
        );
    }
};
