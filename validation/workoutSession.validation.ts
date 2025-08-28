import Joi from 'joi';

/**
 * Validation schemas for workout session endpoints
 */

export const createWorkoutSessionSchema = Joi.object({
    notes: Joi.string().max(200).optional().messages({
        'string.max': 'Notes cannot exceed 200 characters'
    }),
    startTime: Joi.date().iso().required().messages({
        'date.base': 'Start time must be a valid date',
        'any.required': 'Start time is required'
    }),
    endTime: Joi.date().iso().greater(Joi.ref('startTime')).required().messages({
        'date.base': 'End time must be a valid date',
        'date.greater': 'End time must be after start time',
        'any.required': 'End time is required'
    })
});

export const updateWorkoutSessionSchema = Joi.object({
    notes: Joi.string().max(200).optional().messages({
        'string.max': 'Notes cannot exceed 200 characters'
    }),
    startTime: Joi.date().iso().optional().messages({
        'date.base': 'Start time must be a valid date'
    }),
    endTime: Joi.date().iso().optional().messages({
        'date.base': 'End time must be a valid date'
    })
}).custom((value, helpers) => {
    if (value.startTime && value.endTime && new Date(value.endTime) <= new Date(value.startTime)) {
        return helpers.error('custom.endTimeAfterStart');
    }
    return value;
}).messages({
    'custom.endTimeAfterStart': 'End time must be after start time'
});

export const getWorkoutSessionsQuerySchema = Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    clientId: Joi.string().optional(),
    status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'cancelled').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
});
