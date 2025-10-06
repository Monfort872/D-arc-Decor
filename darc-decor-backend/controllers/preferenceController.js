const Preference = require('../models/Preference');
const Service = require('../models/Service');
const { validationResult } = require('express-validator');

// Create preference
exports.createPreference = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceId, eventDate, guestCount, budget, message } = req.body;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const preference = new Preference({
      user: req.user.id,
      service: serviceId,
      eventDate,
      guestCount,
      budget,
      message
    });

    await preference.save();

    // Populate service details in response
    await preference.populate('service');

    res.status(201).json({
      message: 'Preference submitted successfully. We will contact you soon!',
      preference
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user preferences
exports.getUserPreferences = async (req, res) => {
  try {
    const preferences = await Preference.find({ user: req.user.id })
      .populate('service')
      .sort({ createdAt: -1 });

    res.json(preferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all preferences (Admin only)
exports.getAllPreferences = async (req, res) => {
  try {
    const preferences = await Preference.find()
      .populate('service')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(preferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update preference status (Admin only)
exports.updatePreferenceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const preference = await Preference.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('service').populate('user', 'name email phone');

    if (!preference) {
      return res.status(404).json({ message: 'Preference not found' });
    }

    res.json(preference);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};