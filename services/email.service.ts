import { transporter } from '../email/email.config';
import { otpEmailTemplate, sessionDeletionEmailTemplate } from '../email/content/templates';

/**
 * Email Service
 * 
 * Handles sending various types of emails for the gym booking system
 */
export class EmailService {
    /**
    * Send OTP email for password reset
    */
    static async sendOTPEmail(email: string, name: string, otp: string): Promise<void> {
        try {
        const mailOptions = {
            from: `"Gym Web" <noreply@gymweb.com>`,
            to: email,
            subject: 'Password Reset OTP - Gym Web',
            html: otpEmailTemplate(name, otp),
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent successfully to ${email}`);
        } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
        }
    }

    /**
    * Send workout session deletion notification
    */
    static async sendSessionDeletionEmail(
        email: string,
        userName: string,
        sessionTitle: string,
        sessionDate: string,
        sessionTime: string,
        reason?: string
    ): Promise<void> {
        try {
        const mailOptions = {
            from: `"Gym Web" <noreply@gymweb.com>`,
            to: email,
            subject: 'Workout Session Cancelled - Gym Web',
            html: sessionDeletionEmailTemplate(
            userName,
            sessionTitle,
            sessionDate,
            sessionTime,
            reason
            ),
        };

        await transporter.sendMail(mailOptions);
        console.log(`Session deletion email sent successfully to ${email}`);
        } catch (error) {
        console.error('Error sending session deletion email:', error);
        throw new Error('Failed to send session deletion email');
        }
    }

    /**
    * Send general notification email
    */
    static async sendNotificationEmail(
        email: string,
        subject: string,
        htmlContent: string
    ): Promise<void> {
        try {
        const mailOptions = {
            from: `"Gym Web" <noreply@gymweb.com>`,
            to: email,
            subject: subject,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent successfully to ${email}`);
        } catch (error) {
        console.error('Error sending notification email:', error);
        throw new Error('Failed to send notification email');
        }
    }

    /**
    * Validate email configuration
    */
    static async verifyEmailConfig(): Promise<boolean> {
        try {
        await transporter.verify();
        console.log('Email configuration is valid');
        return true;
        } catch (error) {
        console.error('Email configuration error:', error);
        return false;
        }
    }
}
