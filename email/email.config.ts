// Email configuration placeholder
import nodemailer from 'nodemailer';
import { config } from '../config/env';

export const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: Number(config.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
    },
});

// TODO: Implement email configuration
