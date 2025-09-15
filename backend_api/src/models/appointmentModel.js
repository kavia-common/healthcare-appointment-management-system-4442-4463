'use strict';
const { getDb } = require('../config/db');

/**
 * Appointment model with minimal overlap checking using DB constraints. Assumes:
 * - appointments table with unique index on (doctor_id, appointment_time) for simplicity
 */
class AppointmentModel {
  // PUBLIC_INTERFACE
  static async create({ patient_id, doctor_id, appointment_time, reason }) {
    /** Creates an appointment and returns it. */
    const db = getDb();
    const [result] = await db.execute(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_time, reason, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [patient_id, doctor_id, appointment_time, reason || null]
    );
    return this.findById(result.insertId);
  }

  // PUBLIC_INTERFACE
  static async findById(id) {
    /** Returns an appointment by id. */
    const db = getDb();
    const [rows] = await db.execute(
      `SELECT a.*, p.name as patient_name, u.name as doctor_name
       FROM appointments a
       LEFT JOIN patients p ON a.patient_id = p.id
       LEFT JOIN users u ON a.doctor_id = u.id
       WHERE a.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  // PUBLIC_INTERFACE
  static async list({ doctorId, patientId, start, end, limit = 100, offset = 0 } = {}) {
    /** Returns appointments filtered by doctor/patient and date range. */
    const db = getDb();
    const clauses = [];
    const params = [];
    if (doctorId) { clauses.push('a.doctor_id = ?'); params.push(doctorId); }
    if (patientId) { clauses.push('a.patient_id = ?'); params.push(patientId); }
    if (start && end) { clauses.push('a.appointment_time BETWEEN ? AND ?'); params.push(start, end); }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const [rows] = await db.execute(
      `SELECT a.*, p.name as patient_name, u.name as doctor_name
       FROM appointments a
       LEFT JOIN patients p ON a.patient_id = p.id
       LEFT JOIN users u ON a.doctor_id = u.id
       ${where}
       ORDER BY a.appointment_time ASC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );
    return rows;
  }

  // PUBLIC_INTERFACE
  static async update(id, fields) {
    /** Updates appointment fields dynamically. */
    const db = getDb();
    const allowed = ['patient_id', 'doctor_id', 'appointment_time', 'reason'];
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
    await db.execute('UPDATE appointments SET ' + updates.join(', ') + ', updated_at = NOW() WHERE id = ?', params);
    return this.findById(id);
  }

  // PUBLIC_INTERFACE
  static async remove(id) {
    /** Deletes appointment by id. */
    const db = getDb();
    await db.execute('DELETE FROM appointments WHERE id = ?', [id]);
    return { success: true };
  }
}

module.exports = AppointmentModel;
