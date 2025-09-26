import { SignUpInput, SignInInput, SignInResponse, SignUpResponse } from '../types/auth.type';
import { UserService } from './user.service';
import { EmailService } from './email.service';
import { generateJWT } from '../helpers/jwtGenerate.helper';
import { comparePasswords } from '../helpers/compareEncrypt';
import { createError } from '../helpers/controllerHelper';
import { StatusCode } from '../enums/statusCode.enums';
import { UserStatus } from '../enums/userStatus.enums';
import { UserModel } from '../models/user.models';
import { UserInterface } from '../interfaces/user.interfaces';
import { validateUserExists, validateUserApprovalStatus } from '../helpers/userValidation.helper';
import { OTPHelper } from '../helpers/otp.helper';

/**
 * Authentication Service
 *
 * This service handles user authentication operations including login validation,
 * user registration, password management, and token generation.
 */
export class AuthService {
  /**
   * Sign In - Validates user credentials for authentication
   */
  static async signIn(data: SignInInput): Promise<SignInResponse> {
    const { email, password } = data;
    
    // Find user by email
    const user = await UserService.getUserByEmail(email);
    
    // Validate user exists and is not deleted
    if (!user) {
      throw createError('User not found', StatusCode.NOT_FOUND);
    }
    
    validateUserExists(user);

    // Check user approval status for clients
    validateUserApprovalStatus(user);

    // Validate password
    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) {
      throw createError('Invalid email or password', StatusCode.UNAUTHORIZED);
    }

    // Generate JWT token
    const token = generateJWT({
      id: (user._id as unknown as string).toString(),
      email: user.email,
      role: user.role,
      status: user.status as 'pending' | 'approved' | 'rejected',
    });

    return {
      user: {
        id: (user._id as unknown as string).toString(),
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
   * Sign Up - Creates a new user account
   * Note: All new users are automatically assigned 'client' role and 'pending' status
   * Admin role can only be assigned by manually updating the database
   */
  static async signUp(data: SignUpInput): Promise<SignUpResponse> {
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
      id: (newUser._id as unknown as string).toString(),
      email: newUser.email,
      role: newUser.role,
      status: newUser.status as 'pending' | 'approved' | 'rejected',
    });

    return {
      user: {
        id: (newUser._id as unknown as string).toString(),
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
   * Change Password - Updates password for authenticated user
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    // Get user by ID
    const user = await UserService.getUserById(userId);
    
    // Verify current password
    const isValidPassword = await comparePasswords(currentPassword, user.password);
    
    if (!isValidPassword) {
      throw createError('Current password is incorrect', StatusCode.UNAUTHORIZED);
    }

    // Update password
    await UserService.updateUser(userId, {
      password: newPassword
    });
  }

  /**
   * Forgot Password - Sends OTP to email for password reset
   */
  static async forgotPassword(email: string): Promise<void> {
    // Find user by email
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return;
    }

    if (user.isDeleted) {
      return;
    }

    // Generate and store OTP
    const otp = await OTPHelper.createOTP(email);

    // Send OTP email
    try {
      await EmailService.sendOTPEmail(email, user.name, otp);
      console.log(`Password reset OTP sent to user: ${email}`);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      console.log(`Development mode: OTP for ${email} is: ${otp}`);
      // Don't throw error in development - just log the OTP
    }
  }

  /**
   * Reset Password - Validates OTP and resets password
   */
  static async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    // Validate inputs
    if (!email || !otp || !newPassword) {
      throw createError('Email, OTP, and new password are required', StatusCode.BAD_REQUEST);
    }

    // Find user by email
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      throw createError('User not found', StatusCode.NOT_FOUND);
    }

    if (user.isDeleted) {
      throw createError('User account not found', StatusCode.NOT_FOUND);
    }

    // Validate OTP
    const isValidOTP = await OTPHelper.validateOTP(email, otp);
    if (!isValidOTP) {
      throw createError('Invalid or expired OTP', StatusCode.UNAUTHORIZED);
    }

    // Update password
    await UserService.updateUser((user._id as unknown as string).toString(), {
      password: newPassword
    });

    console.log(`Password reset successful for user: ${email}`);
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

  /**
   * Get all pending users (admin only)
   */
  static async getPendingUsers(): Promise<UserInterface[]> {
    return await UserModel.find({
      status: UserStatus.PENDING,
      role: 'client',
      isDeleted: false
    }).sort({ createdAt: -1 });
  }

  /**
   * Update user status (admin only)
   */
  static async updateUserStatus(userId: string, status: string): Promise<{ message: string }> {
    const user = await UserModel.findOne({
      _id: userId,
      isDeleted: false
    });

    if (!user) {
      throw createError('User not found', StatusCode.NOT_FOUND);
    }

    if (user.role === 'admin') {
      throw createError('Cannot update admin status', StatusCode.FORBIDDEN);
    }

    user.status = status as UserStatus;
    await user.save();

    return {
      message: `User status updated to ${status}`
    };
  }

  /**
   * Get all users with filtering (admin only)
   */
  static async getAllUsers(status?: string): Promise<UserInterface[]> {
    const filter: Record<string, unknown> = { isDeleted: false };
    
    if (status) {
      filter.status = status;
    }

    return await UserModel.find(filter).sort({ createdAt: -1 });
  }

  // Backward compatibility methods
  static async login(data: SignInInput): Promise<SignInResponse> {
    return this.signIn(data);
  }

  static async register(data: SignUpInput): Promise<SignUpResponse> {
    return this.signUp(data);
  }
}
