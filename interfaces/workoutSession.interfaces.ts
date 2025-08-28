import { Document, Types } from 'mongoose';
import { WorkoutSessionStatus } from '../enums/workoutSessionStatus.enums';

/**
 * Interface for personal workout session bookings
 * Each session = 1 person booking gym time
 */
export interface WorkoutSessionInterface extends Document {
    _id: Types.ObjectId;
    clientId: Types.ObjectId;
    notes?: string;
    startTime: Date;
    endTime: Date;
    status: WorkoutSessionStatus;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}
