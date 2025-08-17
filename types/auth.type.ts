/**
 * Sign In Request Type
 * 
 * Represents the data required for user authentication.
 * Contains the essential credentials needed to verify a user's identity.
 */
export type SignInInput = {
    email: string;
    password: string;
};

/**
 * Sign In Response Type
 * 
 * Represents the data returned after successful authentication.
 * Contains the authenticated user information and access token.
 */
export type SignInResponse = {
    user: {
        id: string;
        name: string;
        email: string;
        dateOfBirth: Date;
        role: string;
        avatar?: string;
    };
    token: string;
};

/**
 * Sign Up Request Type
 * 
 * Represents the data required for new user registration.
 * Contains all required fields to create a new user account.
 */
export type SignUpInput = {
    name: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    avatar?: string;
};

/**
 * Sign Up Response Type
 * 
 * Represents the data returned after successful user registration.
 * Contains the newly created user information and access token.
 */
export type SignUpResponse = {
    user: {
        id: string;
        name: string;
        email: string;
        dateOfBirth: Date;
        role: string;
        avatar?: string;
    };
    token: string;
};
