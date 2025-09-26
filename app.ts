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

// Trust proxy for Render deployment (fixes rate limiting issues)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000000, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL?.replace(/\/$/, ''), // Remove trailing slash if exists
    'http://localhost:3000',
    'https://gym-web-front-end.vercel.app',
    'https://gym-web-front-end.vercel.app/',
].filter(Boolean); // Remove undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            console.log('Allowed origins:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
