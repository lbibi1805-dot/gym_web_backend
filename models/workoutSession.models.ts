import { Schema, model } from 'mongoose';
import { WorkoutSessionInterface } from '../interfaces/workoutSession.interfaces';
import { WorkoutSessionStatus } from '../enums/workoutSessionStatus.enums';

/**
 * Mongoose schema for workout sessions.
 * 
 * Each session represents ONE person booking gym time.
 * Maximum 8 overlapping sessions allowed (gym capacity).
 */

const workoutSessionSchema = new Schema<WorkoutSessionInterface>(
    {
        clientId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Client ID is required'],
            ref: 'User',
        },
        // Personal session details (user can customize)
        notes: {
            type: String,
            trim: true,
            maxlength: [200, 'Notes cannot exceed 200 characters'],
            default: 'Personal workout session'
        },
        startTime: {
            type: Date,
            required: [true, 'Start time is required'],
        },
        endTime: {
            type: Date,
            required: [true, 'End time is required'],
            validate: {
                validator: function(this: WorkoutSessionInterface, endTime: Date): boolean {
                    return endTime > this.startTime;
                },
                message: 'End time must be after start time'
            }
        },
        status: {
            type: String,
            default: WorkoutSessionStatus.SCHEDULED,
            enum: Object.values(WorkoutSessionStatus),
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for better query performance
workoutSessionSchema.index({ clientId: 1, startTime: 1 });
workoutSessionSchema.index({ startTime: 1, endTime: 1 });
workoutSessionSchema.index({ status: 1 });

/**
 * Mongoose model for workout session documents.
 */
export const WorkoutSessionModel = model<WorkoutSessionInterface>('WorkoutSession', workoutSessionSchema);
