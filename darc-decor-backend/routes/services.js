const express = require('express');
const { body } = require('express-validator');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Validation rules
const serviceValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').isIn(['wedding', 'birthday', 'corporate', 'anniversary', 'baby-shower', 'graduation'])
    .withMessage('Invalid category')
];

// Public routes
router.get('/', getServices);
router.get('/:id', getService);

// Protected admin routes
router.post('/', auth, adminAuth, upload.single('image'), serviceValidation, createService);
router.put('/:id', auth, adminAuth, serviceValidation, updateService);
router.delete('/:id', auth, adminAuth, deleteService);

module.exports = router;