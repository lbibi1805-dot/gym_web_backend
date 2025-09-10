import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { globalErrorHandler } from './helpers/controllerHelper';

// Load environment variables
dotenv.config();

// Import routes
import indexRouter from './routes/index';

// Initialize cron jobs - TEMPORARILY DISABLED FOR TESTING
// import './cron/cronConfig';

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100000, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));

// Basic middleware
app.use(logger('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', indexRouter);

// 404 handler
app.use((_req, res, _next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(globalErrorHandler);

// Database connection
import { connectWithRetry } from './database/mongodb';

// Start server if this file is run directly
const PORT = process.env.PORT || 3000;
if (require.main === module) {
    // Connect to MongoDB first
    connectWithRetry().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
        });
    }).catch((error) => {
        console.error('Failed to start server due to database connection error:', error);
        process.exit(1);
    });
}

export default app;
