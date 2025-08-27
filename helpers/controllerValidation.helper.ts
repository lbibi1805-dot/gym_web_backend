import { Response } from 'express';
import { HttpResponse } from '../helpers/HttpResponse';
import { StatusCode } from '../enums/statusCode.enums';

/**
 * Helper functions for controller validation
 */

/**
 * Validate authenticated user exists and is approved
 * Returns the user ID if valid, sends error response if not
 * Compatible with both middleware auth types
 */
export const validateAuthenticatedUser = (req: { user?: { id: string; status?: string; } }, res: Response): string | null => {
    if (!req.user) {
        res.status(StatusCode.UNAUTHORIZED).json(
            HttpResponse.error('User not authenticated', StatusCode.UNAUTHORIZED)
        );
        return null;
    }

    // Only check status if it exists (for compatibility with different auth types)
    if (req.user.status && req.user.status !== 'approved') {
        res.status(StatusCode.FORBIDDEN).json(
            HttpResponse.error('User account not approved. Please wait for admin approval.', StatusCode.FORBIDDEN)
        );
        return null;
    }

    return req.user.id;
};

/**
 * Handle controller errors with proper typing
 */
export const handleControllerError = (error: unknown, res: Response, next: (error: unknown) => void): void => {
    if (error instanceof Error) {
        // Check for validation errors
        if (error.message.includes('validation') || 
            error.message.includes('already exists') || 
            error.message.includes('only book') || 
            error.message.includes('cannot be more than')) {
            res.status(StatusCode.BAD_REQUEST).json(
                HttpResponse.error(error.message, StatusCode.BAD_REQUEST)
            );
            return;
        }
        
        // Check for not found errors
        if (error.message.includes('not found')) {
            res.status(StatusCode.NOT_FOUND).json(
                HttpResponse.error(error.message, StatusCode.NOT_FOUND)
            );
            return;
        }
        
        // Check for permission errors
        if (error.message.includes('unauthorized') || error.message.includes('permission')) {
            res.status(StatusCode.FORBIDDEN).json(
                HttpResponse.error(error.message, StatusCode.FORBIDDEN)
            );
            return;
        }
        
        // Default to bad request for other known errors
        res.status(StatusCode.BAD_REQUEST).json(
            HttpResponse.error(error.message, StatusCode.BAD_REQUEST)
        );
    } else {
        next(error);
    }
};
