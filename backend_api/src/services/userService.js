'use strict';
const UserModel = require('../models/userModel');
const { hashPassword } = require('../utils/auth');

/**
 * User service handling admin-managed CRUD.
 */
class UserService {
  // PUBLIC_INTERFACE
  static async createUser({ name, email, password, role }) {
    /** Creates a user with hashed password. */
    const passwordHash = await hashPassword(password);
    return UserModel.create({ name, email, passwordHash, role });
  }

  // PUBLIC_INTERFACE
  static async listUsers({ role, q, limit, offset }) {
    /** Lists users with filters. */
    return UserModel.list({ role, q, limit, offset });
  }

  // PUBLIC_INTERFACE
  static async updateUser(id, { name, email, role, password }) {
    /** Updates a user; rehash password if provided. */
    let passwordHash;
    if (password) {
      passwordHash = await hashPassword(password);
    }
    return UserModel.update(id, { name, email, role, passwordHash });
  }

  // PUBLIC_INTERFACE
  static async deleteUser(id) {
    /** Deletes a user. */
    return UserModel.remove(id);
  }

  // PUBLIC_INTERFACE
  static async getUser(id) {
    /** Gets a user by id. */
    return UserModel.findById(id);
  }
}

module.exports = UserService;
