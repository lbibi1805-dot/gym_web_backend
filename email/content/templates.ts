/**
 * Email template for OTP verification
 */
export const otpEmailTemplate = (name: string, otp: string): string => {
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #000; color: #fff;">
        
        <!-- Header Section -->
        <div style="background: #dc2626; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Nguyen Ngoc Tai Fitness</h1>
            <p style="color: #fed7aa; margin: 15px 0 0 0; font-size: 18px; font-weight: 500;">Password Reset Request</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px; border: 1px solid #374151; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="color: #f9fafb; margin-bottom: 24px; font-size: 24px; font-weight: 600;">Xin chào ${name},</h2>
            
            <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 24px; font-size: 16px;">
                Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Vui lòng sử dụng mã OTP sau để tiếp tục quá trình đặt lại mật khẩu:
            </p>
            
            <!-- OTP Box -->
            <div style="background: #374151; padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0; border: 2px solid #f97316;">
                <h1 style="color: #f97316; font-size: 42px; letter-spacing: 2px; margin: 0; font-family: 'Courier New', monospace; font-weight: 700;">
                    ${otp}
                </h1>
                <p style="color: #9ca3af; margin: 15px 0 0 0; font-size: 14px; font-weight: 500;">Mã này có hiệu lực trong 5 phút</p>
            </div>
            
            <!-- Footer -->
            <div style="border-top: 1px solid #374151; padding-top: 24px; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                    Đây là email tự động từ <strong style="color: #f97316;">Nguyen Ngoc Tai Fitness</strong>. Vui lòng không trả lời email này.<br>
                    Nếu bạn cần hỗ trợ, hãy liên hệ với đội ngũ hỗ trợ của chúng tôi.
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
    reason: string = 'quyết định của quản trị viên'
    ): string => {
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #000; color: #fff;">
        
        <!-- Header Section -->
        <div style="background: #dc2626; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">🏋️ Nguyen Ngoc Tai Fitness</h1>
            <p style="color: #fecaca; margin: 15px 0 0 0; font-size: 18px; font-weight: 500;">Thông báo hủy buổi tập</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px; border: 1px solid #374151; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="color: #f9fafb; margin-bottom: 24px; font-size: 24px; font-weight: 600;">Xin chào ${userName},</h2>
            
            <div style="background: #7f1d1d; border: 2px solid #dc2626; padding: 24px; border-radius: 16px; margin: 24px 0;">
                <h3 style="color: #fecaca; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">
                    <span style="font-size: 24px; margin-right: 12px;">❌</span> Buổi tập của bạn đã bị hủy
                </h3>
                
                <div style="background: #374151; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #6b7280;">
                    <p style="margin: 0; color: #f9fafb; font-size: 16px;"><strong style="color: #f97316;">Buổi tập:</strong> ${sessionTitle}</p>
                    <p style="margin: 0; color: #f9fafb; font-size: 16px;"><strong style="color: #f97316;">Ngày:</strong> ${sessionDate}</p>
                    <p style="margin: 0; color: #f9fafb; font-size: 16px;"><strong style="color: #f97316;">Thời gian:</strong> ${sessionTime}</p>
                    <p style="margin: 0; color: #f9fafb; font-size: 16px;"><strong style="color: #f97316;">Lý do:</strong> ${reason}</p>
                </div>
            </div>
            
            <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 24px; font-size: 16px;">
                Chúng tôi xin lỗi vì sự bất tiện này có thể gây ra. Buổi tập của bạn đã được xóa khỏi lịch trình, 
                và bạn có thể đặt buổi tập mới vào thời gian thuận tiện.
            </p>
            
            <!-- Footer -->
            <div style="border-top: 1px solid #374151; padding-top: 24px; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                    Đây là thông báo tự động từ <strong style="color: #f97316;">Nguyen Ngoc Tai Fitness</strong>. Nếu bạn có câu hỏi về việc hủy này, 
                    vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.
                </p>
            </div>
        </div>
        </div>
    `;
};
