import { Request, Response, NextFunction } from 'express';
import { handleError, AppError } from '../helpers/errorHandlers';

const errorMiddleware = (err: Error | AppError, req: Request, res: Response, next: NextFunction): void => {
    handleError(err, req, res, next);
};

export default errorMiddleware;
