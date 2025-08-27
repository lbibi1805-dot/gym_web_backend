import { AuthenticatedRequest } from './common.types';

/**
 * Type definitions for workout session management
 */

export interface CreateWorkoutSessionRequest extends AuthenticatedRequest {
    body: {
        title: string;
        description?: string;
        startTime: string;
        endTime: string;
    };
}

export interface UpdateWorkoutSessionRequest extends AuthenticatedRequest {
    params: {
        sessionId: string;
    };
    body: {
        title?: string;
        description?: string;
        startTime?: string;
        endTime?: string;
    };
}

export interface WorkoutSessionResponse {
    id: string;
    clientId: string;
    clientName: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface GetWorkoutSessionsQuery {
    startDate?: string;
    endDate?: string;
    clientId?: string;
    status?: string;
    page?: number;
    limit?: number;
}
