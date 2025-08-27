import { OTPModel } from '../models/otp.models';

/**
 * OTP Helper
 * 
 * Handles OTP generation, validation, and cleanup operations
 */
export class OTPHelper {
  /**
   * Generate a 6-digit OTP
   */
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Create and store OTP for email
   */
  static async createOTP(email: string): Promise<string> {
    // Remove any existing OTPs for this email
    await OTPModel.deleteMany({ email });

    // Generate new OTP
    const otp = this.generateOTP();
    
    // Store in database
    await OTPModel.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    return otp;
  }

  /**
   * Validate OTP for email
   */
  static async validateOTP(email: string, otp: string): Promise<boolean> {
    const otpRecord = await OTPModel.findOne({ 
      email, 
      otp,
      expiresAt: { $gt: new Date() } // Not expired
    });

    if (!otpRecord) {
      return false;
    }

    // Delete the OTP after successful validation (one-time use)
    await OTPModel.deleteOne({ _id: otpRecord._id });
    
    return true;
  }

  /**
   * Clean expired OTPs (called by cron job)
   */
  static async cleanExpiredOTPs(): Promise<number> {
    const result = await OTPModel.deleteMany({ 
      expiresAt: { $lt: new Date() } 
    });
    return result.deletedCount || 0;
  }

  /**
   * Check if OTP exists and is valid for email
   */
  static async hasValidOTP(email: string): Promise<boolean> {
    const otpRecord = await OTPModel.findOne({ 
      email,
      expiresAt: { $gt: new Date() }
    });
    
    return !!otpRecord;
  }

  /**
   * Delete all OTPs for an email
   */
  static async deleteOTPsForEmail(email: string): Promise<void> {
    await OTPModel.deleteMany({ email });
  }
}
