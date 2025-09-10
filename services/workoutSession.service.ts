import { WorkoutSessionModel } from '../models/workoutSession.models';
import { UserModel } from '../models/user.models';
import { EmailService } from './email.service';
import { 
    WorkoutSessionResponse,
    GetWorkoutSessionsQuery 
} from '../types/workoutSession.types';
import { WorkoutSessionStatus } from '../enums/workoutSessionStatus.enums';
import { validateWorkoutSessionCreation, validateWorkoutSessionUpdate } from '../helpers/workoutSessionValidation.helper';
import { isValidObjectId } from '../helpers/objectIdValidation.helper';

export class WorkoutSessionService {
    /**
     * Create a new workout session with business rules validation
     */
    static async createWorkoutSession(
        clientId: string, 
        sessionData: { notes?: string; startTime: string; endTime: string; }
    ): Promise<WorkoutSessionResponse> {
        const startTime = new Date(sessionData.startTime);
        const endTime = new Date(sessionData.endTime);
        
        // Validate all business rules
        await validateWorkoutSessionCreation(clientId, startTime, endTime);
        
        // Check gym capacity (max 8 overlapping sessions)
        await this.validateGymCapacity(startTime, endTime);

        // Create the session
        const newSession = new WorkoutSessionModel({
            clientId,
            notes: sessionData.notes || 'Personal workout session',
            startTime,
            endTime,
            status: WorkoutSessionStatus.SCHEDULED
        });

        const savedSession = await newSession.save();
        return await this.getWorkoutSessionById(savedSession._id.toString());
    }

    /**
     * Check if gym capacity allows new booking (max 8 overlapping sessions)
     */
    private static async validateGymCapacity(startTime: Date, endTime: Date): Promise<void> {
        const overlappingSessions = await WorkoutSessionModel.countDocuments({
            isDeleted: false,
            status: { $ne: WorkoutSessionStatus.CANCELLED },
            $or: [
                {
                    $and: [
                        { startTime: { $lte: startTime } },
                        { endTime: { $gt: startTime } }
                    ]
                },
                {
                    $and: [
                        { startTime: { $lt: endTime } },
                        { endTime: { $gte: endTime } }
                    ]
                },
                {
                    $and: [
                        { startTime: { $gte: startTime } },
                        { endTime: { $lte: endTime } }
                    ]
                }
            ]
        });

        if (overlappingSessions >= 8) {
            throw new Error('Gym is at full capacity for the selected time slot. Maximum 8 people can workout at the same time.');
        }
    }

    /**
     * Get workout session by ID with client information
     */
    static async getWorkoutSessionById(sessionId: string): Promise<WorkoutSessionResponse> {
        // Validate ObjectId
        if (!isValidObjectId(sessionId)) {
            throw new Error('Invalid session ID format');
        }

        const session = await WorkoutSessionModel.findOne({
            _id: sessionId,
            isDeleted: false
        });

        if (!session) {
            throw new Error('Workout session not found');
        }

        const client = await UserModel.findById(session.clientId);
        
        return {
            id: session._id.toString(),
            clientId: session.clientId.toString(),
            clientName: client?.name || 'Unknown Client',
            notes: session.notes,
            startTime: session.startTime,
            endTime: session.endTime,
            status: session.status,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt
        };
    }

    /**
     * Get workout sessions with filters and pagination
     */
    static async getWorkoutSessions(query: GetWorkoutSessionsQuery): Promise<{
        sessions: WorkoutSessionResponse[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const { startDate, endDate, clientId, status, page = 1, limit = 10 } = query;
        
                const filter: Record<string, unknown> = { isDeleted: false };
        
        if (startDate && endDate) {
            filter.startTime = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else if (startDate) {
            filter.startTime = { $gte: new Date(startDate) };
        } else if (endDate) {
            filter.startTime = { $lte: new Date(endDate) };
        }
        
        if (clientId) {
            filter.clientId = clientId;
        }
        
        if (status) {
            filter.status = status;
        }

        const skip = (page - 1) * limit;
        
        const [sessions, total] = await Promise.all([
            WorkoutSessionModel.find(filter)
                .sort({ startTime: 1 })
                .skip(skip)
                .limit(limit),
            WorkoutSessionModel.countDocuments(filter)
        ]);

        const sessionsWithClientInfo = await Promise.all(
            sessions.map(async (session) => {
                const client = await UserModel.findById(session.clientId);
                return {
                    id: session._id.toString(),
                    clientId: session.clientId.toString(),
                    clientName: client?.name || 'Unknown Client',
                    notes: session.notes,
                    startTime: session.startTime,
                    endTime: session.endTime,
                    status: session.status,
                    createdAt: session.createdAt,
                    updatedAt: session.updatedAt
                };
            })
        );

        return {
            sessions: sessionsWithClientInfo,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    /**
     * Update workout session (only allowed for session owner)
     */
    static async updateWorkoutSession(
        sessionId: string, 
        updateData: { notes?: string; startTime?: string; endTime?: string; },
        clientId: string
    ): Promise<WorkoutSessionResponse> {
        console.log('🔍 Update Session Debug:');
        console.log('  sessionId:', sessionId, 'length:', sessionId.length);
        console.log('  clientId:', clientId, 'length:', clientId.length);
        console.log('  sessionId valid:', isValidObjectId(sessionId));
        console.log('  clientId valid:', isValidObjectId(clientId));
        
        // Validate ObjectIds
        if (!isValidObjectId(sessionId)) {
            console.log('❌ Invalid session ID format:', sessionId);
            throw new Error('Invalid session ID format');
        }
        if (!isValidObjectId(clientId)) {
            console.log('❌ Invalid client ID format:', clientId);
            throw new Error('Invalid client ID format');
        }

        const session = await WorkoutSessionModel.findOne({
            _id: sessionId,
            clientId,
            isDeleted: false
        });

        if (!session) {
            throw new Error('Workout session not found or unauthorized');
        }

        if (session.status === WorkoutSessionStatus.COMPLETED || session.status === WorkoutSessionStatus.CANCELLED) {
            throw new Error('Cannot update completed or cancelled sessions');
        }

        // If updating time, validate the same rules as creation
        if (updateData.startTime || updateData.endTime) {
            const newStartTime = updateData.startTime ? new Date(updateData.startTime) : session.startTime;
            const newEndTime = updateData.endTime ? new Date(updateData.endTime) : session.endTime;
            
            // Validate all business rules for update
            await validateWorkoutSessionUpdate(sessionId, clientId, newStartTime, newEndTime);
        }

        // Update the session
        Object.assign(session, updateData);
        if (updateData.startTime) session.startTime = new Date(updateData.startTime);
        if (updateData.endTime) session.endTime = new Date(updateData.endTime);
        
        const updatedSession = await session.save();
        return await this.getWorkoutSessionById(updatedSession._id.toString());
    }

    /**
     * Delete workout session as client (can only delete own SCHEDULED sessions)
     */
    static async deleteWorkoutSessionAsClient(sessionId: string, clientId: string): Promise<void> {
        // Validate ObjectId
        if (!isValidObjectId(sessionId)) {
            throw new Error('Invalid session ID format');
        }

        if (!isValidObjectId(clientId)) {
            throw new Error('Invalid client ID format');
        }

        const session = await WorkoutSessionModel.findOne({
            _id: sessionId,
            clientId: clientId,
            isDeleted: false
        });

        if (!session) {
            throw new Error('Workout session not found or unauthorized');
        }

        // Check if session is scheduled (clients can only delete scheduled sessions)
        if (session.status !== WorkoutSessionStatus.SCHEDULED) {
            throw new Error('You can only delete scheduled sessions');
        }

        // Check if session is in the future (cannot delete past sessions)
        if (session.startTime <= new Date()) {
            throw new Error('Cannot delete sessions that have already started or ended');
        }

        session.isDeleted = true;
        session.status = WorkoutSessionStatus.CANCELLED;
        await session.save();
    }

    /**
     * Delete workout session as admin (can delete any session and sends notification email)
     */
    static async deleteWorkoutSessionAsAdmin(sessionId: string): Promise<void> {
        // Validate ObjectId
        if (!isValidObjectId(sessionId)) {
            throw new Error('Invalid session ID format');
        }

        const session = await WorkoutSessionModel.findOne({
            _id: sessionId,
            isDeleted: false
        }).populate('clientId');

        if (!session) {
            throw new Error('Workout session not found');
        }

        // Get client information for email notification
        const client = session.clientId as unknown as { email: string; name: string };
        
        // Delete the session
        session.isDeleted = true;
        session.status = WorkoutSessionStatus.CANCELLED;
        await session.save();

        // Send notification email to client
        if (client && client.email) {
            try {
                const sessionDate = session.startTime.toLocaleDateString();
                const sessionTime = session.startTime.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });

                await EmailService.sendSessionDeletionEmail(
                    client.email,
                    client.name,
                    session.notes || 'Personal workout session',
                    sessionDate,
                    sessionTime,
                    'Session cancelled by gym administration'
                );
            } catch (emailError) {
                console.error('Failed to send session deletion email:', emailError);
                // Don't throw error - deletion was successful even if email failed
            }
        }
    }

    /**
     * Delete workout session (legacy method - admin only)
     */
    static async deleteWorkoutSession(sessionId: string): Promise<void> {
        // Validate ObjectId
        if (!isValidObjectId(sessionId)) {
            throw new Error('Invalid session ID format');
        }

        const session = await WorkoutSessionModel.findOne({
            _id: sessionId,
            isDeleted: false
        });

        if (!session) {
            throw new Error('Workout session not found');
        }

        session.isDeleted = true;
        session.status = WorkoutSessionStatus.CANCELLED;
        await session.save();
    }

    /**
     * Get client's workout sessions
     */
    static async getClientSessions(clientId: string): Promise<WorkoutSessionResponse[]> {
        // Validate ObjectId
        if (!isValidObjectId(clientId)) {
            throw new Error('Invalid client ID format');
        }

        const sessions = await WorkoutSessionModel.find({
            clientId,
            isDeleted: false
        }).sort({ startTime: 1 });

        const client = await UserModel.findById(clientId);
        
        return sessions.map(session => ({
            id: session._id.toString(),
            clientId: session.clientId.toString(),
            clientName: client?.name || 'Unknown Client',
            notes: session.notes,
            startTime: session.startTime,
            endTime: session.endTime,
            status: session.status,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt
        }));
    }

    /**
     * Get ALL workout sessions for admin (no filters, no pagination)
     */
    static async getAllSessionsForAdmin(): Promise<WorkoutSessionResponse[]> {
        const sessions = await WorkoutSessionModel.find({ isDeleted: false })
            .sort({ startTime: -1 });

        const sessionsWithClientInfo = await Promise.all(
            sessions.map(async (session) => {
                const client = await UserModel.findById(session.clientId);
                return {
                    id: session._id.toString(),
                    clientId: session.clientId.toString(),
                    clientName: client?.name || 'Unknown Client',
                    notes: session.notes,
                    startTime: session.startTime,
                    endTime: session.endTime,
                    status: session.status,
                    createdAt: session.createdAt,
                    updatedAt: session.updatedAt
                };
            })
        );

        return sessionsWithClientInfo;
    }
}
