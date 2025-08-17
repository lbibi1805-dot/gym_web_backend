import express from 'express';
import { getUsers, getUserById, getCurrentUser, updateUser, deleteUser } from '../controllers/user.controllers';
import authMiddleware from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { updateUserSchema } from '../validation/user.validation';

const router = express.Router();

/**
 * @route GET /users
 * @desc Get all users with pagination
 * @access Private (Admin)
 */
router.get('/', authMiddleware, getUsers);

/**
 * @route GET /users/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authMiddleware, getCurrentUser);

/**
 * @route GET /users/:id
 * @desc Get user by ID
 * @access Private
 */
router.get('/:id', authMiddleware, getUserById);

/**
 * @route PUT /users/:id
 * @desc Update user
 * @access Private
 */
router.put('/:id', authMiddleware, validate(updateUserSchema), updateUser);

/**
 * @route DELETE /users/:id
 * @desc Delete user (soft delete)
 * @access Private (Admin)
 */
router.delete('/:id', authMiddleware, deleteUser);

export default router;
