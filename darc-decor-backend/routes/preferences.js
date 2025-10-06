const express = require('express');
const { body } = require('express-validator');
const {
  createPreference,
  getUserPreferences,
  getAllPreferences,
  updatePreferenceStatus
} = require('../controllers/preferenceController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const preferenceValidation = [
  body('serviceId').notEmpty().withMessage('Service ID is required'),
  body('eventDate').isISO8601().withMessage('Valid event date is required'),
  body('guestCount').isInt({ min: 1 }).withMessage('Guest count must be at least 1'),
  body('budget').isNumeric().withMessage('Budget must be a number')
];

// Protected user routes
router.post('/', auth, preferenceValidation, createPreference);
router.get('/my-preferences', auth, getUserPreferences);

// Admin routes
router.get('/', auth, adminAuth, getAllPreferences);
router.put('/:id/status', auth, adminAuth, updatePreferenceStatus);

module.exports = router;