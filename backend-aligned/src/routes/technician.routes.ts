// Technician Routes

import { Router } from 'express';
import { body, param } from 'express-validator';
import technicianController from '../controllers/technician.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Update availability validation
const updateAvailabilityValidation = [
  param('id').notEmpty().withMessage('Technician ID is required'),
  body('availability')
    .isIn(['available', 'busy', 'offline'])
    .withMessage('Valid availability status is required'),
];

// Update location validation
const updateLocationValidation = [
  param('id').notEmpty().withMessage('Technician ID is required'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
];

// Routes
router.get('/', technicianController.getTechnicians);
router.get('/me', authorize('technician'), technicianController.getCurrentTechnician);
router.get('/available', technicianController.getAvailableTechnicians);
router.get('/:id', technicianController.getTechnicianById);
router.get('/:id/stats', technicianController.getTechnicianStats);
router.patch('/:id/availability', validate(updateAvailabilityValidation), technicianController.updateAvailability);
router.patch('/:id/location', validate(updateLocationValidation), technicianController.updateLocation);

export default router;
