'use strict';
const AuthService = require('../services/authService');

class AuthController {
  // PUBLIC_INTERFACE
  async login(req, res) {
    /** POST /auth/login: Authenticate and return JWT. */
    try {
      const { email, password } = req.body || {};
      if (!email || !password) return res.status(400).json({ status: 'error', message: 'Missing email or password' });
      const result = await AuthService.login({ email, password });
      if (!result.success) return res.status(401).json({ status: 'error', message: result.message });
      return res.status(200).json({ status: 'ok', ...result });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }
}

module.exports = new AuthController();
