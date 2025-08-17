import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../enums/statusCode.enums';
import { ErrorCode } from '../enums/errorCode.enums';

export interface AppError extends Error {
  statusCode?: StatusCode;
  errorCode?: ErrorCode;
  isOperational?: boolean;
}

export const createError = (
  message: string,
  statusCode: StatusCode = StatusCode.INTERNAL_SERVER_ERROR,
  errorCode?: ErrorCode
): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.errorCode = errorCode;
  error.isOperational = true;
  return error;
};

export const handleError = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const appError = err as AppError;
  const statusCode = appError.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  const errorCode = appError.errorCode;

  // Log error for debugging
  console.error('Error:', {
    message,
    statusCode,
    errorCode,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
