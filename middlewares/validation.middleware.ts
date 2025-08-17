import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { HttpResponse } from '../helpers/HttpResponse';
import { StatusCode } from '../enums/statusCode.enums';

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        res.status(StatusCode.BAD_REQUEST).json(
            HttpResponse.badRequest('Validation error', errorMessages)
        );
        return;
        }

        next();
    };
};

export default validate;
