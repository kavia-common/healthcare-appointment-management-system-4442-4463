'use strict';
const { getDb } = require('../config/db');

/**
 * Patient model data access.
 */
class PatientModel {
  // PUBLIC_INTERFACE
  static async create({ name, place, date_of_birth, reason_for_visit, gender, assigned_doctor_id, fees_collected }) {
    /** Inserts a patient row and returns it. */
    const db = getDb();
    const [result] = await db.execute(
      `INSERT INTO patients
        (name, place, date_of_birth, reason_for_visit, gender, assigned_doctor_id, fees_collected, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, place, date_of_birth, reason_for_visit, gender, assigned_doctor_id, fees_collected || 0]
    );
    return this.findById(result.insertId);
  }

  // PUBLIC_INTERFACE
  static async findById(id) {
    /** Returns a patient by id or null. */
    const db = getDb();
    const [rows] = await db.execute(
      `SELECT p.*, u.name as assigned_doctor_name
       FROM patients p
       LEFT JOIN users u ON p.assigned_doctor_id = u.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  // PUBLIC_INTERFACE
  static async list({ q, doctorId, limit = 50, offset = 0 } = {}) {
    /** Lists patients with optional search and doctor filter. */
    const db = getDb();
    const clauses = [];
    const params = [];
    if (q) {
      clauses.push('(p.name LIKE ? OR p.place LIKE ? OR p.reason_for_visit LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (doctorId) {
      clauses.push('p.assigned_doctor_id = ?');
      params.push(doctorId);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const [rows] = await db.execute(
      `SELECT p.*, u.name as assigned_doctor_name
       FROM patients p
       LEFT JOIN users u ON p.assigned_doctor_id = u.id
       ${where}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );
    return rows;
  }

  // PUBLIC_INTERFACE
  static async update(id, fields) {
    /** Updates patient fields dynamically. */
    const db = getDb();
    const allowed = ['name', 'place', 'date_of_birth', 'reason_for_visit', 'gender', 'assigned_doctor_id', 'fees_collected'];
    const updates = [];
    const params = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        params.push(fields[key]);
      }
    }
    if (!updates.length) return this.findById(id);
    params.push(id);
    await db.execute('UPDATE patients SET ' + updates.join(', ') + ', updated_at = NOW() WHERE id = ?', params);
    return this.findById(id);
  }

  // PUBLIC_INTERFACE
  static async remove(id) {
    /** Deletes patient by id. */
    const db = getDb();
    await db.execute('DELETE FROM patients WHERE id = ?', [id]);
    return { success: true };
  }
}

module.exports = PatientModel;
