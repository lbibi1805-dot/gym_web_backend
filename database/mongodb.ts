import mongoose from 'mongoose';
import { config } from '../config/env';

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(config.MONGODB_URI as string);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
