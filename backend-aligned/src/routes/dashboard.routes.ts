// Dashboard Routes

import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Most dashboard routes are for operations/admin only
router.get('/', authorize('operations', 'admin'), dashboardController.getDashboardData);
router.get('/stats', authorize('operations', 'admin'), dashboardController.getStats);
router.get('/jobs-per-day', authorize('operations', 'admin'), dashboardController.getJobsPerDay);
router.get('/jobs-by-category', authorize('operations', 'admin'), dashboardController.getJobsByCategory);
router.get('/sla-compliance', authorize('operations', 'admin'), dashboardController.getSLACompliance);

export default router;
