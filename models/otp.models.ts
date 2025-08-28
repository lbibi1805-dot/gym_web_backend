import { Schema, model } from 'mongoose';
import { OTPInterface } from '../interfaces/otp.interfaces';

const otpSchema = new Schema<OTPInterface>(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        otp: {
            type: String,
            required: true,
            length: 6,
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Index for automatic deletion of expired documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster email lookups
otpSchema.index({ email: 1 });

export const OTPModel = model<OTPInterface>('OTP', otpSchema);
