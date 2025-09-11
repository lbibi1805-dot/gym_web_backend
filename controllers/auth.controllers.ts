import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { HttpResponse } from '../helpers/HttpResponse';
import { StatusCode } from '../enums/statusCode.enums';
import { AuthenticatedRequest } from '../types/common.types';
import { validateAuthenticatedUser } from '../helpers/controllerValidation.helper';

export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        
        const result = await AuthService.signIn({ email, password });
        
        res.status(StatusCode.OK).json(
        HttpResponse.success(result, 'Sign in successful')
        );
    } catch (err) {
        next(err);
    }
};

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password, dateOfBirth, avatar } = req.body;
        
        const result = await AuthService.signUp({
            name,
            email,
            password,
            dateOfBirth,
            avatar
        });
        
        res.status(StatusCode.CREATED).json(
            HttpResponse.created(result, 'Sign up successful')
        );
    } catch (err) {
        next(err);
    }
};

export const signOut = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // For JWT, logout is handled client-side by removing the token
        res.status(StatusCode.OK).json(
            HttpResponse.success(null, 'Sign out successful')
        );
    } catch (err) {
        next(err);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = validateAuthenticatedUser(req as any, res);
        if (!userId) return;
        
        const { currentPassword, newPassword } = req.body;
        await AuthService.changePassword(userId, currentPassword, newPassword);
        
        res.status(StatusCode.OK).json(
            HttpResponse.success(null, 'Password changed successfully')
        );

    } catch (err) {
        next(err);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body;
        
        await AuthService.forgotPassword(email);
        
        res.status(StatusCode.OK).json(
            HttpResponse.success(null, 'Password reset instructions sent to your email')
        );
    } catch (err) {
        next(err);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, otp, newPassword } = req.body;
        
        await AuthService.resetPassword(email, otp, newPassword);
        
        res.status(StatusCode.OK).json(
            HttpResponse.success(null, 'Password reset successful')
        );
    } catch (err) {
        next(err);
    }
};

/**
 * Get all pending users (admin only)
 */
export const getPendingUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await AuthService.getPendingUsers();
        
        res.status(StatusCode.OK).json(
            HttpResponse.success(users, 'Pending users retrieved successfully')
        );
    } catch (err) {
        next(err);
    }
};

/**
 * Update user status (admin only)
 */
export const updateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, status } = req.body;
        
        const result = await AuthService.updateUserStatus(userId, status);
        
        res.status(StatusCode.OK).json(
            HttpResponse.success(result, 'User status updated successfully')
        );
    } catch (err) {
        next(err);
    }
};

/**
 * Get all users with filtering (admin only)
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = req.query;
        
        const users = await AuthService.getAllUsers(status as string);
        
        res.status(StatusCode.OK).json(
            HttpResponse.success(users, 'Users retrieved successfully')
        );
    } catch (err) {
        next(err);
    }
};

/**
 * Get user profile
 */
export const getUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = validateAuthenticatedUser(req, res);
        if (!userId) return;
        
        const user = await UserService.getUserById(userId);
        
        res.status(StatusCode.OK).json(
            HttpResponse.success(user, 'User profile retrieved successfully')
        );
    } catch (err) {
        next(err);
    }
};

// Backward compatibility aliases
export const login = signIn;
export const register = signUp;
export const logout = signOut;
