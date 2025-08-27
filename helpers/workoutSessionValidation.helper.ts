import { WorkoutSessionModel } from '../models/workoutSession.models';
import { WorkoutSessionStatus } from '../enums/workoutSessionStatus.enums';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, addWeeks, differenceInHours } from 'date-fns';

/**
 * Helper functions for workout session validation and business rules
 */

/**
 * Validate session duration (max 3 hours)
 */
export const validateSessionDuration = (startTime: Date, endTime: Date): void => {
    const durationHours = differenceInHours(endTime, startTime);
    if (durationHours > 3) {
        throw new Error('Workout session cannot exceed 3 hours');
    }
};

/**
 * Validate booking timeframe (within current and next week only)
 */
export const validateBookingTimeframe = (startTime: Date): void => {
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const nextWeekEnd = endOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 });
    
    if (startTime < currentWeekStart || startTime > nextWeekEnd) {
        throw new Error('You can only book sessions within the current and next week');
    }
};

/**
 * Check if client already has a session on the same day
 */
export const validateDailySessionLimit = async (clientId: string, startTime: Date, excludeSessionId?: string): Promise<void> => {
    const dayStart = startOfDay(startTime);
    const dayEnd = endOfDay(startTime);
    
    const filter: Record<string, unknown> = {
        clientId,
        startTime: { $gte: dayStart, $lte: dayEnd },
        status: { $ne: WorkoutSessionStatus.CANCELLED },
        isDeleted: false
    };

    if (excludeSessionId) {
        filter._id = { $ne: excludeSessionId };
    }

    const existingSessionSameDay = await WorkoutSessionModel.findOne(filter);

    if (existingSessionSameDay) {
        throw new Error('You cannot have more than one workout session per day');
    }
};

/**
 * Check for overlapping sessions (max 8 concurrent sessions)
 */
export const validateConcurrentSessionsLimit = async (startTime: Date, endTime: Date, excludeSessionId?: string): Promise<void> => {
    const filter: Record<string, unknown> = {
        $or: [
            {
                startTime: { $lt: endTime },
                endTime: { $gt: startTime }
            }
        ],
        status: { $ne: WorkoutSessionStatus.CANCELLED },
        isDeleted: false
    };

    if (excludeSessionId) {
        filter._id = { $ne: excludeSessionId };
    }

    const overlappingSessions = await WorkoutSessionModel.find(filter);

    if (overlappingSessions.length >= 8) {
        throw new Error('Maximum 8 concurrent workout sessions allowed. Please choose a different time slot.');
    }
};

/**
 * Validate all business rules for creating a workout session
 */
export const validateWorkoutSessionCreation = async (
    clientId: string, 
    startTime: Date, 
    endTime: Date
): Promise<void> => {
    validateSessionDuration(startTime, endTime);
    validateBookingTimeframe(startTime);
    await validateDailySessionLimit(clientId, startTime);
    await validateConcurrentSessionsLimit(startTime, endTime);
};

/**
 * Validate all business rules for updating a workout session
 */
export const validateWorkoutSessionUpdate = async (
    sessionId: string,
    clientId: string, 
    startTime: Date, 
    endTime: Date
): Promise<void> => {
    validateSessionDuration(startTime, endTime);
    validateBookingTimeframe(startTime);
    await validateDailySessionLimit(clientId, startTime, sessionId);
    await validateConcurrentSessionsLimit(startTime, endTime, sessionId);
};
