import Joi from 'joi';

export const validateInput = <T = unknown>(schema: Joi.ObjectSchema, data: unknown): { error?: Joi.ValidationError; value?: T } => {
  return schema.validate(data, { abortEarly: false, allowUnknown: false, stripUnknown: true });
};
