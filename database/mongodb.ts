import mongoose from 'mongoose';
import { config } from '../config/env';

const connectDB = async (): Promise<void> => {
    try {
        // Set mongoose options
        mongoose.set('strictQuery', false);
        mongoose.set('bufferCommands', false); // Disable mongoose buffering
        
        const conn = await mongoose.connect(config.MONGODB_URI as string, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
