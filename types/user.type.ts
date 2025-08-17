import { UserInterface } from '../interfaces/user.interfaces';

/**
 * Create User Input Type
 * 
 * Represents the data required to create a new user account.
 * Contains all necessary fields for user registration and creation.
 */
export type CreateUserInput = {
    name: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    role?: string;
    avatar?: string;
};

/**
 * Update User Input Type
 * 
 * Represents the data that can be updated for an existing user.
 * All fields are optional, allowing partial updates to user information.
 * This type supports both user self-service updates and administrative changes.
 */
export type UpdateUserInput = {
    name?: string;
    email?: string;
    password?: string;
    dateOfBirth?: Date;
    avatar?: string;
    role?: string;
    isDeleted?: boolean;
};

/**
 * Update Password Input Type
 * 
 * Represents the data required to update a user's password.
 * This type defines the structure for password change operations,
 * including verification of the current password and confirmation
 * of the new password to prevent errors.
 */
export type UpdatePasswordInput = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

/**
 * User List Response Type
 * 
 * Represents the response structure when retrieving a list of users.
 * Includes both the user data and pagination information for navigating
 * large result sets.
 */
export type UserListResponse = {
    users: UserInterface[];
    pagination: {
        page: number;
        limit: number;
        totalPages: number;
        totalUsers: number;
    };
};

/**
 * User Response Type
 * 
 * Represents a user object without sensitive information.
 * Used for API responses where password should not be included.
 */
export type UserResponse = Omit<UserInterface, 'password'>;
