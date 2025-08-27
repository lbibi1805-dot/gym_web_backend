import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { HttpResponse } from '../helpers/HttpResponse';
import { StatusCode } from '../enums/statusCode.enums';

/**
 * Helper function to handle validation errors
 */
const handleValidationError = (error: Joi.ValidationError, res: Response): void => {
    const errorMessages: string[] = error.details.map(detail => detail.message);
    res.status(StatusCode.BAD_REQUEST).json(
        HttpResponse.badRequest('Validation error', errorMessages)
    );
};

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            handleValidationError(error, res);
            return;
        }

        next();
    };
};

export const validateRequest = (schema: Joi.ObjectSchema, source: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        let dataToValidate: unknown;
        
        switch (source) {
            case 'query':
                dataToValidate = req.query;
                break;
            case 'params':
                dataToValidate = req.params;
                break;
            default:
                dataToValidate = req.body;
                break;
        }

        const { error } = schema.validate(dataToValidate, { abortEarly: false });

        if (error) {
            handleValidationError(error, res);
            return;
        }

        next();
    };
};

export default validate;
