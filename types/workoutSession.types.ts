import { AuthenticatedRequest } from './common.types';

/**
 * Type definitions for workout session management
 */

export interface CreateWorkoutSessionRequest extends AuthenticatedRequest {
    body: {
        notes?: string;
        startTime: string;
        endTime: string;
    };
}

export interface UpdateWorkoutSessionRequest extends AuthenticatedRequest {
    params: {
        id: string;  // Changed from sessionId to id to match route
    };
    body: {
        notes?: string;
        startTime?: string;
        endTime?: string;
    };
}

export interface WorkoutSessionResponse {
    id: string;
    clientId: string;
    clientName: string;
    notes?: string;
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
