import express from 'express';
import { login, register, logout } from '../controllers/auth.controllers';
import { validate } from '../middlewares/validation.middleware';
import { loginSchema, registerSchema } from '../validation/auth.validation';

const router = express.Router();

/**
 * @route POST /auth/login
 * @desc User login
 * @access Public
 */
router.post('/login', validate(loginSchema), login);

/**
 * @route POST /auth/register
 * @desc User registration
 * @access Public
 */
router.post('/register', validate(registerSchema), register);

/**
 * @route POST /auth/logout
 * @desc User logout
 * @access Private
 */
router.post('/logout', logout);


export default router;
