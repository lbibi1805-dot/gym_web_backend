// Main routes index
import express from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import workoutSessionRoutes from './workoutSession.routes';
import { testJWT } from '../controllers/test.controller';

const router = express.Router();

// Import and use specific route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/workout-sessions', workoutSessionRoutes);

// Test endpoints
router.get('/test/jwt', testJWT);

// Health check endpoint
router.get('/health', (_req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Gym Web Backend API is running',
        timestamp: new Date().toISOString()
    });
});

export default router;
