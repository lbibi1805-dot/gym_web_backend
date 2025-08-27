/**
 * Email template for OTP verification
 */
export const otpEmailTemplate = (name: string, otp: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🏋️ Gym Web</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
      </div>
      
      <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-bottom: 20px;">Hi ${name},</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          We received a request to reset your password. Please use the following OTP to proceed with your password reset:
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
          <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
            ${otp}
          </h1>
          <p style="color: #888; margin: 10px 0 0 0; font-size: 14px;">This code expires in 5 minutes</p>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. 
            Your account remains secure.
          </p>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
          Enter this OTP on the password reset page to continue. The code is valid for 5 minutes from the time this email was sent.
        </p>
        
        <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px;">
          <p style="color: #888; font-size: 12px; line-height: 1.4; margin: 0;">
            This is an automated email from Gym Web. Please don't reply to this email.<br>
            If you need help, contact our support team.
          </p>
        </div>
      </div>
    </div>
  `;
};

/**
 * Email template for workout session deletion notification
 */
export const sessionDeletionEmailTemplate = (
  userName: string, 
  sessionTitle: string, 
  sessionDate: string,
  sessionTime: string,
  reason: string = 'administrative decision'
): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🏋️ Gym Web</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Session Cancellation Notice</p>
      </div>
      
      <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-bottom: 20px;">Hi ${userName},</h2>
        
        <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #e53e3e; margin: 0 0 15px 0; font-size: 18px;">
            ❌ Your workout session has been cancelled
          </h3>
          
          <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <p style="margin: 0 0 8px 0; color: #333;"><strong>Session:</strong> ${sessionTitle}</p>
            <p style="margin: 0 0 8px 0; color: #333;"><strong>Date:</strong> ${sessionDate}</p>
            <p style="margin: 0 0 8px 0; color: #333;"><strong>Time:</strong> ${sessionTime}</p>
            <p style="margin: 0; color: #666;"><strong>Reason:</strong> ${reason}</p>
          </div>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          We apologize for any inconvenience this may cause. Your session has been removed from your schedule, 
          and you can book a new session at your convenience.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Book New Session
          </a>
        </div>
        
        <div style="background: #e8f4fd; border: 1px solid #bee5eb; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="color: #0c5460; margin: 0; font-size: 14px;">
            <strong>💡 Tip:</strong> To avoid future cancellations, please ensure you book sessions within our guidelines 
            and arrive on time for your scheduled workouts.
          </p>
        </div>
        
        <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px;">
          <p style="color: #888; font-size: 12px; line-height: 1.4; margin: 0;">
            This is an automated notification from Gym Web. If you have questions about this cancellation, 
            please contact our support team.<br>
            Email: support@gymweb.com | Phone: (555) 123-4567
          </p>
        </div>
      </div>
    </div>
  `;
};
