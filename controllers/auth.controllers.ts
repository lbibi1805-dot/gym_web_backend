import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { HttpResponse } from '../helpers/HttpResponse';
import { StatusCode } from '../enums/statusCode.enums';
import { handleControllerError } from '../helpers/controllerHelper';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await AuthService.login(req.body);
        res.status(StatusCode.OK).json(HttpResponse.success(result, 'Login successful'));
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await AuthService.register(req.body);
        res.status(StatusCode.CREATED).json(HttpResponse.created(result, 'Registration successful'));
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
    // For JWT, logout is handled client-side by removing the token
    res.status(StatusCode.OK).json(HttpResponse.success(null, 'Logout successful'));
};
