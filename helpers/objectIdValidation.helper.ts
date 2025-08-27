import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from './HttpResponse';
import { StatusCode } from '../enums/statusCode.enums';

/**
 * Helper functions for MongoDB ObjectId validation
 */

/**
 * Check if a string is a valid MongoDB ObjectId
 */
export const isValidObjectId = (id: string): boolean => {
    console.log('🔍 Validating ObjectId:');
    console.log('  Input:', id, typeof id);
    console.log('  Length:', id.length);
    console.log('  Valid format:', Types.ObjectId.isValid(id));
    
    // Test creating new ObjectId
    try {
        const testId = new Types.ObjectId(id);
        console.log('  Can create ObjectId:', testId.toString());
        return Types.ObjectId.isValid(id);
    } catch (error) {
        console.log('  Error creating ObjectId:', error);
        return false;
    }
};

/**
 * Validate ObjectId and send error response if invalid
 * Returns true if valid, false if invalid (and sends error response)
 */
export const validateObjectId = (id: string, res: Response, fieldName: string = 'ID'): boolean => {
    if (!isValidObjectId(id)) {
        res.status(StatusCode.BAD_REQUEST).json(
            HttpResponse.error(`Invalid ${fieldName}`, StatusCode.BAD_REQUEST)
        );
        return false;
    }
    return true;
};

/**
 * Validate multiple ObjectIds
 * Returns array of validation results
 */
export const validateMultipleObjectIds = (ids: string[]): boolean[] => {
    return ids.map(id => isValidObjectId(id));
};

/**
 * Convert string to ObjectId if valid, throw error if invalid
 */
export const toObjectId = (id: string): Types.ObjectId => {
    if (!isValidObjectId(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
    }
    return new Types.ObjectId(id);
};

/**
 * Validate ObjectId for middleware usage
 */
export const validateObjectIdMiddleware = (fieldName: string = 'id') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const id = req.params[fieldName];
        
        if (!id) {
            res.status(StatusCode.BAD_REQUEST).json(
                HttpResponse.error(`${fieldName} parameter is required`, StatusCode.BAD_REQUEST)
            );
            return;
        }

        if (!validateObjectId(id, res, fieldName)) {
            return;
        }

        next();
    };
};
