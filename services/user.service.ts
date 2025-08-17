import { UserInterface } from '../interfaces/user.interfaces';
import { CreateUserInput, UpdateUserInput } from '../types/user.type';
import { UserModel } from '../models/user.models';
import { hashPassword } from '../helpers/compareEncrypt';
import { createError } from '../helpers/controllerHelper';
import { StatusCode } from '../enums/statusCode.enums';

/**
 * User Service
 *
 * This service handles all user-related operations including user creation,
 * profile management, and account administration.
 */
export class UserService {
    /**
    * Creates a new user account
    */
    static async createUser(data: CreateUserInput): Promise<UserInterface> {
        try {
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email: data.email });
        if (existingUser) {
            throw createError('Email already exists', StatusCode.CONFLICT);
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password);

        // Create user
        const userData = {
            ...data,
            password: hashedPassword,
            role: data.role || 'user',
        };

        const newUser = new UserModel(userData);
        await newUser.save();
        
        return newUser;
        } catch (error) {
        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error;
        }
        const mongoError = error as { code?: number };
        if (mongoError.code === 11000) {
            throw createError('Email already exists', StatusCode.CONFLICT);
        }
        throw createError('Failed to create user', StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
    * Get all users with pagination
    */
    static async getAllUsers(page: number = 1, limit: number = 10): Promise<{
        users: UserInterface[];
        total: number;
        totalPages: number;
        currentPage: number;
    }> {
        const skip = (page - 1) * limit;
        
        const users = await UserModel
        .find({ isDeleted: false })
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

        const total = await UserModel.countDocuments({ isDeleted: false });
        const totalPages = Math.ceil(total / limit);

        return {
        users,
        total,
        totalPages,
        currentPage: page,
        };
    }

    /**
    * Get user by ID
    */
    static async getUserById(id: string): Promise<UserInterface> {
        const user = await UserModel
        .findOne({ _id: id, isDeleted: false })
        .select('-password');
        
        if (!user) {
        throw createError('User not found', StatusCode.NOT_FOUND);
        }
        
        return user;
    }

    /**
    * Get user by email
    */
    static async getUserByEmail(email: string): Promise<UserInterface | null> {
        return await UserModel.findOne({ 
        email: email.toLowerCase(), 
        isDeleted: false 
        });
    }

    /**
    * Update user
    */
    static async updateUser(id: string, data: UpdateUserInput): Promise<UserInterface> {
        try {
        // Check if user exists
        const existingUser = await UserModel.findOne({ _id: id, isDeleted: false });
        if (!existingUser) {
            throw createError('User not found', StatusCode.NOT_FOUND);
        }

        // If updating email, check if it's already taken by another user
        if (data.email && data.email !== existingUser.email) {
            const emailExists = await UserModel.findOne({ 
            email: data.email.toLowerCase(), 
            _id: { $ne: id },
            isDeleted: false 
            });
            if (emailExists) {
            throw createError('Email already exists', StatusCode.CONFLICT);
            }
        }

        // Hash new password if provided
        if (data.password) {
            data.password = await hashPassword(data.password);
        }

        const updatedUser = await UserModel
            .findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: data },
            { new: true, runValidators: true }
            )
            .select('-password');

        return updatedUser!;
        } catch (error) {
        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error;
        }
        const mongoError = error as { code?: number };
        if (mongoError.code === 11000) {
            throw createError('Email already exists', StatusCode.CONFLICT);
        }
        throw createError('Failed to update user', StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
    * Soft delete user
    */
    static async deleteUser(id: string): Promise<{ message: string }> {
        const user = await UserModel.findOne({ _id: id, isDeleted: false });
        if (!user) {
        throw createError('User not found', StatusCode.NOT_FOUND);
        }

        await UserModel.findOneAndUpdate(
        { _id: id },
        { $set: { isDeleted: true } },
        { new: true }
        );

        return { message: 'User deleted successfully' };
    }

    /**
    * Get current user profile
    */
    static async getCurrentUser(userId: string): Promise<UserInterface> {
        const user = await UserModel
        .findOne({ _id: userId, isDeleted: false })
        .select('-password');
        
        if (!user) {
        throw createError('User not found', StatusCode.NOT_FOUND);
        }
        
        return user;
    }
}
