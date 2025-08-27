import { Document, Types } from 'mongoose';
import { WorkoutSessionStatus } from '../enums/workoutSessionStatus.enums';

/**
 * Interface for workout session in the gym system
 */
export interface WorkoutSessionInterface extends Document {
    _id: Types.ObjectId;
    clientId: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    status: WorkoutSessionStatus;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}
