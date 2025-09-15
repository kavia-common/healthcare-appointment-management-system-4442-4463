'use strict';
const UserModel = require('../models/userModel');
const { comparePassword, generateToken, hashPassword } = require('../utils/auth');

/**
 * Authentication service with role-based login and simple user management helpers.
 */
class AuthService {
  // PUBLIC_INTERFACE
  static async login({ email, password }) {
    /** Validates user credentials and returns token and user info. */
    const user = await UserModel.findWithSecretByEmail(email);
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }
    const ok = await comparePassword(password, user.password_hash);
    if (!ok) {
      return { success: false, message: 'Invalid credentials' };
    }
    const token = generateToken({ id: user.id, role: user.role, name: user.name, email: user.email });
    return {
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  // PUBLIC_INTERFACE
  static async seedAdminIfMissing({ name, email, password }) {
    /** Helper to ensure an admin exists (used at startup optionally). */
    const existing = await UserModel.findWithSecretByEmail(email);
    if (existing) return { created: false, user: { id: existing.id, name: existing.name, email: existing.email, role: existing.role } };
    const passwordHash = await hashPassword(password);
    const created = await UserModel.create({ name, email, passwordHash, role: 'admin' });
    return { created: true, user: created };
  }
}

module.exports = AuthService;
