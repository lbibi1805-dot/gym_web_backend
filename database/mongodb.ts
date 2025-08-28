import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables FIRST
dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        // Debug environment variables
        console.log('NODE_ENV:', process.env.NODE_ENV);
        console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
        console.log('MONGODB_URI value:', process.env.MONGODB_URI?.substring(0, 20) + '...');
        
        // Set mongoose options
        mongoose.set('strictQuery', false);
        mongoose.set('bufferCommands', false); // Disable mongoose buffering
        
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gym_web';
        console.log('Connecting to MongoDB with URI:', mongoUri?.substring(0, 20) + '...');
        
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            maxPoolSize: 10,
            minPoolSize: 2,
            maxIdleTimeMS: 30000,
            waitQueueTimeoutMS: 30000,
        });
        
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });
        
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        console.error('Connection string:', process.env.MONGODB_URI?.substring(0, 50) + '...');
        
        // Don't exit process, let the app handle the error
        throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

// Add connection retry logic
const connectWithRetry = async (retries = 5): Promise<void> => {
    try {
        await connectDB();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`MongoDB connection attempt failed: ${errorMessage}`);
        console.error(`Retries left: ${retries - 1}`);
        
        if (retries > 1) {
            console.log('Retrying in 5 seconds...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            return connectWithRetry(retries - 1);
        } else {
            console.error('All MongoDB connection attempts failed. Please check your connection string and network.');
            throw error;
        }
    }
};

export { connectDB, connectWithRetry };
