import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../helpers/HttpResponse';
import { StatusCode } from '../enums/statusCode.enums';

export interface AppError extends Error {
    statusCode?: StatusCode;
    isOperational?: boolean;
}

export const createError = (
    message: string,
    statusCode: StatusCode = StatusCode.INTERNAL_SERVER_ERROR,
): AppError => {
    const error: AppError = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};

export const handleControllerError = (res: Response, error: unknown): void => {
    if (error && typeof error === 'object' && 'statusCode' in error) {
        const httpError = error as { statusCode: number; message: string };
        res.status(httpError.statusCode).json(HttpResponse.error(httpError.message, httpError.statusCode));
    } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json(
        HttpResponse.error('Internal server error')
        );
    }
};

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export const globalErrorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const appError = err as AppError;
    const statusCode = appError.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal Server Error';

    // Log error for debugging
    console.error('Error:', {
        message,
        statusCode,
        stack: err.stack,
        url: req.url,
        method: req.method,
    });

    res.status(statusCode).json(HttpResponse.error(message, statusCode));
};
