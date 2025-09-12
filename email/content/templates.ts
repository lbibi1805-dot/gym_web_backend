/**
 * Email template for OTP verification
 */
export const otpEmailTemplate = (name: string, otp: string): string => {
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%); color: #f9fafb;">
        
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; box-shadow: 0 4px 20px rgba(249, 115, 22, 0.3);">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);"> Nguyen Ngoc Tai Fitness</h1>
            <p style="color: #fed7aa; margin: 15px 0 0 0; font-size: 18px; font-weight: 500;">Password Reset Request</p>
        </div>
        
        <!-- Main Content -->
        <div style="background: linear-gradient(180deg, #1f2937 0%, #111827 100%); padding: 40px; border: 1px solid #374151; border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">
            <h2 style="color: #f9fafb; margin-bottom: 24px; font-size: 24px; font-weight: 600;">Xin chào ${name},</h2>
            
            <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 24px; font-size: 16px;">
                Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Vui lòng sử dụng mã OTP sau để tiếp tục quá trình đặt lại mật khẩu:
            </p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, #374151 0%, #4b5563 100%); padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0; border: 2px solid #f97316; box-shadow: 0 0 20px rgba(249, 115, 22, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);">
                <h1 style="color: #f97316; font-size: 42px; letter-spacing: 2px; margin: 0; font-family: 'Courier New', monospace; font-weight: 700; text-shadow: 0 2px 8px rgba(249, 115, 22, 0.3); word-wrap: break-word;">
                    ${otp}
                </h1>
                <p style="color: #9ca3af; margin: 15px 0 0 0; font-size: 14px; font-weight: 500;">Mã này có hiệu lực trong 5 phút</p>
            </div>
            
            <!-- Security Notice -->
            <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); border: 1px solid #f87171; padding: 20px; border-radius: 12px; margin: 24px 0; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);">
                <p style="color: #fef2f2; margin: 0; font-size: 14px; line-height: 1.5;">
                    <strong style="color: #fed7d7;">⚠️ Thông báo bảo mật:</strong> Nếu bạn không yêu cầu đặt lại mật khẩu này, vui lòng bỏ qua email này. 
                    Tài khoản của bạn vẫn được bảo vệ an toàn.
                </p>
            </div>
            
            <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 30px; font-size: 16px;">
                Nhập mã OTP này trên trang đặt lại mật khẩu để tiếp tục. Mã có hiệu lực trong 5 phút kể từ khi email này được gửi.
            </p>
            
            <!-- Footer -->
            <div style="border-top: 1px solid #374151; padding-top: 24px; margin-top: 30px; background: linear-gradient(90deg, transparent 0%, #374151 50%, transparent 100%); background-size: 100% 1px; background-repeat: no-repeat; background-position: top;">
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
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%);">
        
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3);">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🏋️ Nguyen Ngoc Tai Fitness</h1>
            <p style="color: #fecaca; margin: 15px 0 0 0; font-size: 18px; font-weight: 500;">Thông báo hủy buổi tập</p>
        </div>
        
        <!-- Main Content -->
        <div style="background: linear-gradient(180deg, #1f2937 0%, #111827 100%); padding: 40px; border: 1px solid #374151; border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">
            <h2 style="color: #f9fafb; margin-bottom: 24px; font-size: 24px; font-weight: 600;">Xin chào ${userName},</h2>
            
            <!-- Cancellation Notice Box -->
            <div style="background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); border: 2px solid #dc2626; padding: 24px; border-radius: 16px; margin: 24px 0; box-shadow: 0 0 20px rgba(220, 38, 38, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);">
                <h3 style="color: #fecaca; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
                    <span style="font-size: 24px; margin-right: 12px;">❌</span> Buổi tập của bạn đã bị hủy
                </h3>
                
                <!-- Session Details -->
                <div style="background: linear-gradient(135deg, #374151 0%, #4b5563 100%); padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #6b7280;">
                    <div style="display: grid; gap: 12px;">
                        <p style="margin: 0; color: #f9fafb; font-size: 16px;"><strong style="color: #f97316;">Buổi tập:</strong> <span style="color: #d1d5db;">${sessionTitle}</span></p>
                        <p style="margin: 0; color: #f9fafb; font-size: 16px;"><strong style="color: #f97316;">Ngày:</strong> <span style="color: #d1d5db;">${sessionDate}</span></p>
                        <p style="margin: 0; color: #f9fafb; font-size: 16px;"><strong style="color: #f97316;">Thời gian:</strong> <span style="color: #d1d5db;">${sessionTime}</span></p>
                        <p style="margin: 0; color: #f9fafb; font-size: 16px;"><strong style="color: #f97316;">Lý do:</strong> <span style="color: #9ca3af;">${reason}</span></p>
                    </div>
                </div>
            </div>
            
            <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 24px; font-size: 16px;">
                Chúng tôi xin lỗi vì sự bất tiện này có thể gây ra. Buổi tập của bạn đã được xóa khỏi lịch trình, 
                và bạn có thể đặt buổi tập mới vào thời gian thuận tiện.
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3); transition: all 0.2s ease;">
                    🏋️ Đặt buổi tập mới
                </a>
            </div>
            
            <!-- Tip Box -->
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border: 1px solid #3b82f6; padding: 20px; border-radius: 12px; margin: 24px 0; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);">
                <p style="color: #dbeafe; margin: 0; font-size: 14px; line-height: 1.5;">
                    <strong style="color: #93c5fd;">💡 Mẹo:</strong> Để tránh việc hủy buổi tập trong tương lai, vui lòng đảm bảo bạn đặt buổi tập 
                    trong khung thời gian cho phép và đến đúng giờ cho các buổi tập đã lên lịch.
                </p>
            </div>
            
            <!-- Footer -->
            <div style="border-top: 1px solid #374151; padding-top: 24px; margin-top: 30px; background: linear-gradient(90deg, transparent 0%, #374151 50%, transparent 100%); background-size: 100% 1px; background-repeat: no-repeat; background-position: top;">
                <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                    Đây là thông báo tự động từ <strong style="color: #f97316;">Nguyen Ngoc Tai Fitness</strong>. Nếu bạn có câu hỏi về việc hủy này, 
                    vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.<br>
                    <strong style="color: #9ca3af;">Email:</strong> support@nguyenngoctaifitness.com | <strong style="color: #9ca3af;">Điện thoại:</strong> (84) 123-456-789
                </p>
            </div>
        </div>
        </div>
    `;
};
