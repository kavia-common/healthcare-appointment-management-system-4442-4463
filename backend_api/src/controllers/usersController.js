'use strict';
const UserService = require('../services/userService');

class UsersController {
  // PUBLIC_INTERFACE
  async create(req, res) {
    /** POST /users: Admin creates user */
    try {
      const { name, email, password, role } = req.body || {};
      if (!name || !email || !password || !role) {
        return res.status(400).json({ status: 'error', message: 'Missing fields' });
      }
      const user = await UserService.createUser({ name, email, password, role });
      return res.status(201).json({ status: 'ok', data: user });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async list(req, res) {
    /** GET /users: List users */
    try {
      const { role, q, limit, offset } = req.query;
      const users = await UserService.listUsers({ role, q, limit, offset });
      return res.status(200).json({ status: 'ok', data: users });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async get(req, res) {
    /** GET /users/:id: Get user by id */
    try {
      const id = Number(req.params.id);
      const user = await UserService.getUser(id);
      if (!user) return res.status(404).json({ status: 'error', message: 'Not found' });
      return res.status(200).json({ status: 'ok', data: user });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res) {
    /** PUT /users/:id: Update user */
    try {
      const id = Number(req.params.id);
      const { name, email, role, password } = req.body || {};
      const user = await UserService.updateUser(id, { name, email, role, password });
      return res.status(200).json({ status: 'ok', data: user });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async delete(req, res) {
    /** DELETE /users/:id: Delete user */
    try {
      const id = Number(req.params.id);
      await UserService.deleteUser(id);
      return res.status(200).json({ status: 'ok' });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }
}

module.exports = new UsersController();
