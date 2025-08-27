import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { HttpResponse } from '../helpers/HttpResponse';
import { StatusCode } from '../enums/statusCode.enums';
import { AuthenticatedRequest } from '../types/common.types';
import { validateAuthenticatedUser } from '../helpers/controllerValidation.helper';

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        const result = await UserService.getAllUsers(page, limit);
        res.status(StatusCode.OK).json(HttpResponse.success(result, 'Users retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await UserService.getUserById(id);
        res.status(StatusCode.OK).json(HttpResponse.success(user, 'User retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = validateAuthenticatedUser(req, res);
        if (!userId) return;
        
        const user = await UserService.getCurrentUser(userId);
        res.status(StatusCode.OK).json(HttpResponse.success(user, 'Current user retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newUser = await UserService.createUser(req.body);
        res.status(StatusCode.CREATED).json(HttpResponse.created(newUser, 'User created successfully'));
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedUser = await UserService.updateUser(id, req.body);
        res.status(StatusCode.OK).json(HttpResponse.success(updatedUser, 'User updated successfully'));
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await UserService.deleteUser(id);
        res.status(StatusCode.OK).json(HttpResponse.success(result, 'User deleted successfully'));
    } catch (err) {
        next(err);
    }
};
