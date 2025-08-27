import { UserInterface } from '../interfaces/user.interfaces';
import { UserStatus } from '../enums/userStatus.enums';
import { StatusCode } from '../enums/statusCode.enums';
import { createError } from './controllerHelper';

/**
 * Helper functions for user validation and status checking
 */

/**
 * Validate user approval status for clients
 * Throws error if user is not approved (for clients only)
 */
export const validateUserApprovalStatus: (user: UserInterface) => void = (user: UserInterface): void => {
    if (user.role === 'client' && user.status !== UserStatus.APPROVED) {
        if (user.status === UserStatus.PENDING) {
            throw createError('Your account is pending admin approval', StatusCode.FORBIDDEN);
        } else if (user.status === UserStatus.REJECTED) {
            throw createError('Your account has been rejected', StatusCode.FORBIDDEN);
        } else if (user.status === UserStatus.SUSPENDED) {
            throw createError('Your account has been suspended', StatusCode.FORBIDDEN);
        }
    }
};

/**
 * Validate user exists and is not deleted
 */
export const validateUserExists: (user: UserInterface | null) => asserts user is UserInterface = (user: UserInterface | null): asserts user is UserInterface => {
    if (!user) {
        throw createError('Invalid email or password', StatusCode.UNAUTHORIZED);
    }

    if (user.isDeleted) {
        throw createError('Account has been deactivated', StatusCode.UNAUTHORIZED);
    }
};

/**
 * Check if user can perform admin actions
 */
export const validateAdminRole = (user: UserInterface): void => {
    if (user.role !== 'admin') {
        throw createError('Admin access required', StatusCode.FORBIDDEN);
    }
};

/**
 * Validate user approval status specifically for API access
 * Used by approvedUser middleware
 */
export const validateUserApproved = (user: UserInterface): void => {
    if (user.status !== UserStatus.APPROVED) {
        throw createError('Your account needs to be approved by admin before accessing this resource', StatusCode.FORBIDDEN);
    }
};
