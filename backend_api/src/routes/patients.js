'use strict';
const express = require('express');
const patientsController = require('../controllers/patientsController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management (nurse/admin)
 */

router.get('/', authenticate, authorize(['nurse', 'admin', 'doctor']), patientsController.list.bind(patientsController));
router.post('/', authenticate, authorize(['nurse', 'admin']), patientsController.create.bind(patientsController));
router.get('/:id', authenticate, authorize(['nurse', 'admin', 'doctor']), patientsController.get.bind(patientsController));
router.put('/:id', authenticate, authorize(['nurse', 'admin']), patientsController.update.bind(patientsController));
router.delete('/:id', authenticate, authorize(['admin']), patientsController.delete.bind(patientsController));

module.exports = router;
