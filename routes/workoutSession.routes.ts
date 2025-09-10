import express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import { approvedUserMiddleware } from '../middlewares/approvedUser.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { WorkoutSessionController } from '../controllers/workoutSession.controllers';
import { validateRequest } from '../middlewares/validation.middleware';
import { 
    createWorkoutSessionSchema, 
    updateWorkoutSessionSchema,
    getWorkoutSessionsQuerySchema 
} from '../validation/workoutSession.validation';

const router = express.Router();

/**
 * @route POST /api/workout-sessions
 * @desc Create a new workout session
 * @access Private (Approved Clients only)
 */
router.post(
    '/',
    authMiddleware,
    approvedUserMiddleware,
    validateRequest(createWorkoutSessionSchema),
    WorkoutSessionController.createWorkoutSession
);

/**
 * @route GET /api/workout-sessions
 * @desc Get all workout sessions with filters (Admin only)
 * @access Private (Admin only)
 */
router.get(
    '/',
    authMiddleware,
    adminMiddleware,
    validateRequest(getWorkoutSessionsQuerySchema, 'query'),
    WorkoutSessionController.getWorkoutSessions
);

// Admin alias (matches documentation) -> GET /api/workout-sessions/admin/all
router.get(
    '/admin/all',
    authMiddleware,
    adminMiddleware,
    WorkoutSessionController.getAllSessionsForAdmin
);

/**
 * @route GET /api/workout-sessions/all
 * @desc Get all workout sessions (for clients to see gym schedule)
 * @access Private (Approved Clients)
 */
router.get(
    '/all',
    authMiddleware,
    approvedUserMiddleware,
    validateRequest(getWorkoutSessionsQuerySchema, 'query'),
    WorkoutSessionController.getWorkoutSessions
);

/**
 * @route GET /api/workout-sessions/my
 * @desc Get current user's workout sessions
 * @access Private (Approved Clients only)
 */
router.get(
    '/my',
    authMiddleware,
    approvedUserMiddleware,
    WorkoutSessionController.getMyWorkoutSessions
);

/**
 * @route GET /api/workout-sessions/client/:clientId
 * @desc Get workout sessions for a specific client (Admin only)
 * @access Private (Admin only)
 */
router.get(
    '/client/:clientId',
    authMiddleware,
    adminMiddleware,
    WorkoutSessionController.getClientWorkoutSessions
);

/**
 * @route GET /api/workout-sessions/:id
 * @desc Get workout session by ID
 * @access Private
 */
router.get(
    '/:id',
    authMiddleware,
    WorkoutSessionController.getWorkoutSessionById
);

/**
 * @route PUT /api/workout-sessions/:id
 * @desc Update workout session (Session owner only)
 * @access Private (Session owner only)
 */
router.put(
    '/:id',
    authMiddleware,
    approvedUserMiddleware,
    validateRequest(updateWorkoutSessionSchema),
    WorkoutSessionController.updateWorkoutSession
);

/**
 * @route DELETE /api/workout-sessions/:id
 * @desc Delete workout session (Admin can delete any, Client can delete own)
 * @access Private (Admin/Client)
 */
router.delete(
    '/:id',
    authMiddleware,
    approvedUserMiddleware, // Changed from adminMiddleware to approvedUserMiddleware
    WorkoutSessionController.deleteWorkoutSession
);

export default router;
