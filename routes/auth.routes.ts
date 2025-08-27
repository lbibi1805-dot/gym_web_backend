import express from 'express';
import { 
    signIn, 
    signUp, 
    signOut, 
    changePassword, 
    forgotPassword, 
    resetPassword,
    getPendingUsers,
    updateUserStatus,
    getAllUsers,
    getUserProfile,
    // Backward compatibility
    login, 
    register, 
    logout 
} from '../controllers/auth.controllers';
import { validate } from '../middlewares/validation.middleware';
import { 
    signInSchema, 
    signUpSchema, 
    updateUserStatusSchema,
    forgotPasswordSchema, 
    resetPasswordSchema,
    changePasswordSchema
} from '../validation/auth.validation';

import authenticateToken from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = express.Router();


router.post('/sign-in', validate(signInSchema), signIn);


router.post('/sign-up', validate(signUpSchema), signUp);


router.post('/sign-out', authenticateToken, signOut);


router.post('/change-password', authenticateToken, validate(changePasswordSchema), changePassword);


router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);


router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

// Admin routes
router.get('/pending-users', authenticateToken, adminMiddleware, getPendingUsers);
router.put('/users/status', authenticateToken, adminMiddleware, validate(updateUserStatusSchema), updateUserStatus);
router.get('/users', authenticateToken, adminMiddleware, getAllUsers);

// User profile
router.get('/profile', authenticateToken, getUserProfile);

// Backward compatibility routes
router.post('/login', validate(signInSchema), login);
router.post('/register', validate(signUpSchema), register);


router.post('/logout', authenticateToken, logout);

export default router;
