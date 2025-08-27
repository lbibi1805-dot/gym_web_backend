/**
 * OTP Interface
 * 
 * Defines the structure for OTP (One-Time Password) documents
 */
export interface OTPInterface {
    _id?: string;
    email: string;
    otp: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}