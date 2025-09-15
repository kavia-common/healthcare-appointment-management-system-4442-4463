'use strict';
const { getDb } = require('../config/db');

/**
 * User model data access.
 * roles: 'admin' | 'doctor' | 'nurse'
 */
class UserModel {
  // PUBLIC_INTERFACE
  static async create({ name, email, passwordHash, role }) {
    /** Creates a new user and returns created row. */
    const db = getDb();
    const [result] = await db.execute(
      `INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [name, email, passwordHash, role]
    );
    return this.findById(result.insertId);
  }

  // PUBLIC_INTERFACE
  static async findById(id) {
    /** Returns a user by id or null. */
    const db = getDb();
    const [rows] = await db.execute('SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  // PUBLIC_INTERFACE
  static async findWithSecretByEmail(email) {
    /** Returns user with password_hash by email (for auth). */
    const db = getDb();
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  // PUBLIC_INTERFACE
  static async list({ role, q, limit = 50, offset = 0 } = {}) {
    /** Lists users with optional role filter and search query. */
    const db = getDb();
    const clauses = [];
    const params = [];
    if (role) {
      clauses.push('role = ?');
      params.push(role);
    }
    if (q) {
      clauses.push('(name LIKE ? OR email LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const [rows] = await db.execute(
      `SELECT id, name, email, role, created_at, updated_at
       FROM users
       ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );
    return rows;
  }

  // PUBLIC_INTERFACE
  static async update(id, { name, email, role, passwordHash }) {
    /** Updates user fields; passwordHash optional. */
    const db = getDb();
    const updates = [];
    const params = [];
    if (name != null) { updates.push('name = ?'); params.push(name); }
    if (email != null) { updates.push('email = ?'); params.push(email); }
    if (role != null) { updates.push('role = ?'); params.push(role); }
    if (passwordHash != null) { updates.push('password_hash = ?'); params.push(passwordHash); }

    if (!updates.length) return this.findById(id);

    params.push(id);
    await db.execute(`UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, params);
    return this.findById(id);
  }

  // PUBLIC_INTERFACE
  static async remove(id) {
    /** Deletes user by id. */
    const db = getDb();
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    return { success: true };
  }
}

module.exports = UserModel;
