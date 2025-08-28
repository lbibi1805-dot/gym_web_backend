// Email configuration
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Create transporter with environment variables
export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify email configuration on module load
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter.verify((error, _success) => {
        if (error) {
            console.log('❌ Email configuration error:', error.message);
        } else {
            console.log('✅ Email server is ready to take our messages');
        }
    });
} else {
    console.warn('⚠️  Email configuration is incomplete. Email services may not work properly.');
    console.warn('   Please set EMAIL_HOST, EMAIL_USER, EMAIL_PASS in your .env file');
}
