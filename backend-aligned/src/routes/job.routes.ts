// Job Routes

import { Router } from 'express';
import { body, param } from 'express-validator';
import jobController from '../controllers/job.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create job validation
const createJobValidation = [
  body('issueCategory').notEmpty().withMessage('Issue category is required'),
  body('priority')
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Valid priority is required'),
  body('building').notEmpty().withMessage('Building is required'),
  body('unit').notEmpty().withMessage('Unit is required'),
  body('tenant').notEmpty().withMessage('Tenant is required'),
  body('tenantId').notEmpty().withMessage('Tenant ID is required'),
  body('description').notEmpty().withMessage('Description is required'),
];

// Update status validation
const updateStatusValidation = [
  param('id').notEmpty().withMessage('Job ID is required'),
  body('status')
    .isIn(['pending', 'assigned', 'in-progress', 'completed', 'escalated'])
    .withMessage('Valid status is required'),
];

// Assign job validation
const assignJobValidation = [
  param('id').notEmpty().withMessage('Job ID is required'),
  body('technicianId').notEmpty().withMessage('Technician ID is required'),
];

// Complete job validation
const completeJobValidation = [
  param('id').notEmpty().withMessage('Job ID is required'),
  body('actualDuration').isInt({ min: 1 }).withMessage('Valid actual duration is required'),
];

// Routes
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);
router.get('/ticket/:ticketId', jobController.getJobByTicketId);
router.post('/', authorize('operations', 'admin'), validate(createJobValidation), jobController.createJob);
router.patch('/:id/status', validate(updateStatusValidation), jobController.updateJobStatus);
router.patch('/:id/assign', authorize('operations', 'admin'), validate(assignJobValidation), jobController.assignJob);
router.patch('/:id/complete', validate(completeJobValidation), jobController.completeJob);
router.delete('/:id', authorize('operations', 'admin'), jobController.deleteJob);

export default router;
