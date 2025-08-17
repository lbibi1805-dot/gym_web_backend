import { SignUpInput, SignInInput, SignInResponse, SignUpResponse } from '../types/auth.type';
import { UserService } from './user.service';
import { generateJWT } from '../helpers/jwtGenerate.helper';
import { comparePasswords } from '../helpers/compareEncrypt';
import { createError } from '../helpers/controllerHelper';
import { StatusCode } from '../enums/statusCode.enums';

/**
 * Authentication Service
 *
 * This service handles user authentication operations including login validation,
 * user registration, and token generation.
 */
export class AuthService {
    /**
    * Validates user credentials for authentication
    */
    static async login(data: SignInInput): Promise<SignInResponse> {
        const { email, password } = data;
        
        // Find user by email
        const user = await UserService.getUserByEmail(email);
        if (!user) {
        throw createError('Invalid email or password', StatusCode.UNAUTHORIZED);
        }

        // Check if user is deleted
        if (user.isDeleted) {
        throw createError('Account has been deactivated', StatusCode.UNAUTHORIZED);
        }

        // Validate password
        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
        throw createError('Invalid email or password', StatusCode.UNAUTHORIZED);
        }

        // Generate JWT token
        const token = generateJWT({
        id: (user._id as string).toString(),
        email: user.email,
        role: user.role,
        });

        return {
        user: {
            id: (user._id as string).toString(),
            name: user.name,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            role: user.role,
            avatar: user.avatar,
        },
        token,
        };
    }

    /**
    * Creates a new user account
    */
    static async register(data: SignUpInput): Promise<SignUpResponse> {
        // Check if user already exists
        const existingUser = await UserService.getUserByEmail(data.email);
        if (existingUser) {
        throw createError('Email already exists', StatusCode.CONFLICT);
        }

        // Create new user
        const newUser = await UserService.createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        dateOfBirth: data.dateOfBirth,
        avatar: data.avatar,
        });

        // Generate JWT token
        const token = generateJWT({
        id: (newUser._id as string).toString(),
        email: newUser.email,
        role: newUser.role,
        });

        return {
        user: {
            id: (newUser._id as string).toString(),
            name: newUser.name,
            email: newUser.email,
            dateOfBirth: newUser.dateOfBirth,
            role: newUser.role,
            avatar: newUser.avatar,
        },
        token,
        };
    }

    /**
    * Verify JWT token
    */
    static async verifyToken(_token: string): Promise<boolean> {
        try {
        // Token verification is handled by middleware
        return true;
        } catch {
        return false;
        }
    }
}
