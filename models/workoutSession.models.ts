import { Schema, model } from 'mongoose';
import { WorkoutSessionInterface } from '../interfaces/workoutSession.interfaces';
import { WorkoutSessionStatus } from '../enums/workoutSessionStatus.enums';

/**
 * Mongoose schema for workout sessions.
 * 
 * This schema defines the structure for workout session documents in MongoDB,
 * representing gym booking sessions with time constraints and user limitations.
 */

const workoutSessionSchema = new Schema<WorkoutSessionInterface>(
    {
        clientId: {
            type: String,
            required: [true, 'Client ID is required'],
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
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
