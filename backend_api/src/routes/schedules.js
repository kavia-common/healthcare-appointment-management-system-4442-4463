'use strict';
const express = require('express');
const schedulesController = require('../controllers/schedulesController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: Doctor schedule management
 */

// Upsert schedule (doctor can edit only for self; admin for any)
router.put('/', authenticate, authorize(['doctor', 'admin']), async (req, res, next) => {
  const role = req.user.role;
  if (role === 'doctor' && req.body.doctor_id !== req.user.id) {
    return res.status(403).json({ status: 'error', message: 'Doctors can only edit their own schedule' });
  }
  return schedulesController.upsert(req, res, next);
});

// Get specific date schedule
router.get('/:doctorId/:date', authenticate, authorize(['nurse', 'doctor', 'admin']), schedulesController.get.bind(schedulesController));

// List doctor schedules in range
router.get('/:doctorId', authenticate, authorize(['nurse', 'doctor', 'admin']), schedulesController.listByDoctor.bind(schedulesController));

// Delete schedule
router.delete('/:doctorId/:date', authenticate, authorize(['doctor', 'admin']), async (req, res, next) => {
  const role = req.user.role;
  if (role === 'doctor' && Number(req.params.doctorId) !== req.user.id) {
    return res.status(403).json({ status: 'error', message: 'Doctors can only delete their own schedule' });
  }
  return schedulesController.remove(req, res, next);
});

module.exports = router;
