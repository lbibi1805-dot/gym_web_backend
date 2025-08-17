import { Schema, model } from 'mongoose';
import { UserInterface } from '../interfaces/user.interfaces';

/**
 * Mongoose schema for user accounts.
 * 
 * This schema defines the structure for user documents in MongoDB,
 * representing application users with authentication details and permissions.
 * It includes validation rules and default values for various user properties.
 */
const userSchema = new Schema<UserInterface>(
    {
        name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        },
        email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        },
        password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        },
        dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required'],
        },
        avatar: {
        type: String,
        default: '',
        },
        role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
        },
        isDeleted: {
        type: Boolean,
        default: false,
        },
    },
    {
        timestamps: true,
    },
);

/**
 * Mongoose model for user documents.
 * 
 * This model provides an interface for creating, querying, updating, and
 * deleting user accounts in the MongoDB 'user' collection.
 */
export const UserModel = model<UserInterface>('User', userSchema);
