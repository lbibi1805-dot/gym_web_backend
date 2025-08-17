import { Document } from 'mongoose';

/**
 * Interface for user accounts in the system
 * 
 * Represents a user profile with authentication information, personal details,
 * and system limitations. This interface extends Mongoose's Document type to enable
 * direct use with Mongoose models while providing type safety for user-related operations.
 */
export interface UserInterface extends Document {
    name: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    role: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}
