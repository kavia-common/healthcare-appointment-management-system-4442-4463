'use strict';
const express = require('express');
const appointmentsController = require('../controllers/appointmentsController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management
 */

router.get('/', authenticate, authorize(['nurse', 'doctor', 'admin']), appointmentsController.list.bind(appointmentsController));
router.post('/', authenticate, authorize(['nurse', 'admin']), appointmentsController.create.bind(appointmentsController));
router.get('/:id', authenticate, authorize(['nurse', 'doctor', 'admin']), appointmentsController.get.bind(appointmentsController));
router.put('/:id', authenticate, authorize(['nurse', 'admin']), appointmentsController.update.bind(appointmentsController));
router.delete('/:id', authenticate, authorize(['admin']), appointmentsController.delete.bind(appointmentsController));

module.exports = router;
