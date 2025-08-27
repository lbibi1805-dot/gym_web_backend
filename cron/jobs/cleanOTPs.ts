import { OTPHelper } from '../../helpers/otp.helper';

/**
 * Clean expired OTPs from database
 * Runs every 10 minutes to clean up expired OTP records
 */
export const cleanExpiredOTPs = async (): Promise<void> => {
  try {
    const deletedCount = await OTPHelper.cleanExpiredOTPs();
    if (deletedCount > 0) {
      console.log(`[CRON] Cleaned ${deletedCount} expired OTP records`);
    }
  } catch (error) {
    console.error('[CRON] Error cleaning expired OTPs:', error);
  }
};
