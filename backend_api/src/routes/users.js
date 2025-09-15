'use strict';
const express = require('express');
const usersController = require('../controllers/usersController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (admin only)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List users
 *     tags: [Users]
 *   post:
 *     summary: Create user
 *     tags: [Users]
 */
router.get('/', authenticate, authorize(['admin']), usersController.list.bind(usersController));
router.post('/', authenticate, authorize(['admin']), usersController.create.bind(usersController));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by id
 *     tags: [Users]
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 */
router.get('/:id', authenticate, authorize(['admin']), usersController.get.bind(usersController));
router.put('/:id', authenticate, authorize(['admin']), usersController.update.bind(usersController));
router.delete('/:id', authenticate, authorize(['admin']), usersController.delete.bind(usersController));

module.exports = router;
