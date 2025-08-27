import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/common.types';
import { WorkoutSessionService } from '../services/workoutSession.service';
import { HttpResponse } from '../helpers/HttpResponse';
import { StatusCode } from '../enums/statusCode.enums';
import { 
    CreateWorkoutSessionRequest, 
    UpdateWorkoutSessionRequest, 
    GetWorkoutSessionsQuery 
} from '../types/workoutSession.types';
import { validateAuthenticatedUser, handleControllerError } from '../helpers/controllerValidation.helper';

export class WorkoutSessionController {
    /**
     * Create a new workout session
     */
    public static async createWorkoutSession(
        req: CreateWorkoutSessionRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = validateAuthenticatedUser(req, res);
            if (!userId) return;

            const result = await WorkoutSessionService.createWorkoutSession(userId, req.body);
            
            res.status(StatusCode.CREATED).json(
                HttpResponse.success(result, 'Workout session created successfully')
            );
        } catch (error) {
            handleControllerError(error, res, next);
        }
    }

    /**
     * Get workout sessions with filters
     */
    static async getWorkoutSessions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const query: GetWorkoutSessionsQuery = req.query;

            const result = await WorkoutSessionService.getWorkoutSessions(query);

            res.status(StatusCode.OK).json(
                HttpResponse.success(result, 'Workout sessions retrieved successfully')
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get workout session by ID
     */
    static async getWorkoutSessionById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const session = await WorkoutSessionService.getWorkoutSessionById(id);

            res.status(StatusCode.OK).json(
                HttpResponse.success(session, 'Workout session retrieved successfully')
            );
        } catch (error) {
            handleControllerError(error, res, next);
        }
    }

    /**
     * Update an existing workout session
     */
    public static async updateWorkoutSession(
        req: UpdateWorkoutSessionRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = validateAuthenticatedUser(req, res);
            if (!userId) return;

            const { sessionId } = req.params;
            const result = await WorkoutSessionService.updateWorkoutSession(sessionId, req.body, userId);

            res.status(StatusCode.OK).json(
                HttpResponse.success(result, 'Workout session updated successfully')
            );
        } catch (error) {
            handleControllerError(error, res, next);
        }
    }

    /**
     * Delete workout session
     * - Clients can delete their own SCHEDULED sessions
     * - Admins can delete any session and will send notification email
     */
    static async deleteWorkoutSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = validateAuthenticatedUser(req, res);
            if (!userId) return;

            const { id } = req.params;
            const user = req.user; // From auth middleware
            
            if (user?.role === 'admin') {
                // Admin can delete any session and send notification
                await WorkoutSessionService.deleteWorkoutSessionAsAdmin(id);
            } else {
                // Client can only delete their own SCHEDULED sessions
                await WorkoutSessionService.deleteWorkoutSessionAsClient(id, userId);
            }

            res.status(StatusCode.OK).json(
                HttpResponse.success(null, 'Workout session deleted successfully')
            );
        } catch (error) {
            handleControllerError(error, res, next);
        }
    }

    /**
     * Get client's own workout sessions
     */
    static async getMyWorkoutSessions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = validateAuthenticatedUser(req, res);
            if (!userId) return;

            const sessions = await WorkoutSessionService.getClientSessions(userId);

            res.status(StatusCode.OK).json(
                HttpResponse.success(sessions, 'Your workout sessions retrieved successfully')
            );
        } catch (error) {
            handleControllerError(error, res, next);
        }
    }

    /**
     * Get workout sessions for a specific client (admin only)
     */
    static async getClientWorkoutSessions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = validateAuthenticatedUser(req, res);
            if (!userId) return;

            const { clientId } = req.params;
            const sessions = await WorkoutSessionService.getClientSessions(clientId);

            res.status(StatusCode.OK).json(
                HttpResponse.success(sessions, 'Client workout sessions retrieved successfully')
            );
        } catch (error) {
            handleControllerError(error, res, next);
        }
    }
}
