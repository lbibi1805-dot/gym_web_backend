import Joi from 'joi';

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string().min(6).optional().messages({
    'string.min': 'Password must be at least 6 characters long',
  }),
  dateOfBirth: Joi.date().iso().max('now').optional().messages({
    'date.base': 'Date of birth must be a valid date',
    'date.max': 'Date of birth cannot be in the future',
  }),
  avatar: Joi.string().uri().optional().messages({
    'string.uri': 'Avatar must be a valid URL',
  }),
  role: Joi.string().valid('admin', 'user').optional().messages({
    'any.only': 'Role must be either admin or user',
  }),
});

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
  dateOfBirth: Joi.date().iso().max('now').required().messages({
    'date.base': 'Date of birth must be a valid date',
    'date.max': 'Date of birth cannot be in the future',
    'any.required': 'Date of birth is required',
  }),
  avatar: Joi.string().uri().optional().messages({
    'string.uri': 'Avatar must be a valid URL',
  }),
  role: Joi.string().valid('admin', 'user').optional().default('user').messages({
    'any.only': 'Role must be either admin or user',
  }),
});

export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).required().messages({
    'string.min': 'Current password must be at least 6 characters long',
    'any.required': 'Current password is required',
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'New password must be at least 6 characters long',
    'any.required': 'New password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Password confirmation does not match new password',
    'any.required': 'Password confirmation is required',
  }),
});
