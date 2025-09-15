const express = require('express');
const healthController = require('../controllers/health');

const authRoutes = require('./auth');
const userRoutes = require('./users');
const patientRoutes = require('./patients');
const scheduleRoutes = require('./schedules');
const appointmentRoutes = require('./appointments');

const router = express.Router();

// Health endpoint
/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Healthcheck
 */
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Mount feature routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/appointments', appointmentRoutes);

module.exports = router;
