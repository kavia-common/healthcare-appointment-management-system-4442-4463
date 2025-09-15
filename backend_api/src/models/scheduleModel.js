'use strict';
const { getDb } = require('../config/db');

/**
 * Schedules for doctors with daily plans.
 * plan_type ENUM('operation','outpatient','rounds','off')
 */
class ScheduleModel {
  // PUBLIC_INTERFACE
  static async upsert({ doctor_id, date, plan_type, notes }) {
    /** Inserts or updates a schedule for a doctor/date. */
    const db = getDb();
    await db.execute(
      `INSERT INTO schedules (doctor_id, date, plan_type, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE plan_type = VALUES(plan_type), notes = VALUES(notes), updated_at = NOW()`,
      [doctor_id, date, plan_type, notes || null]
    );
    return this.getByDoctorAndDate(doctor_id, date);
  }

  // PUBLIC_INTERFACE
  static async getByDoctorAndDate(doctor_id, date) {
    /** Returns schedule for doctor and date. */
    const db = getDb();
    const [rows] = await db.execute('SELECT * FROM schedules WHERE doctor_id = ? AND date = ?', [doctor_id, date]);
    return rows[0] || null;
  }

  // PUBLIC_INTERFACE
  static async listByDoctor({ doctor_id, start, end }) {
    /** Returns schedules for a doctor in a date range. */
    const db = getDb();
    const [rows] = await db.execute(
      'SELECT * FROM schedules WHERE doctor_id = ? AND date BETWEEN ? AND ? ORDER BY date ASC',
      [doctor_id, start, end]
    );
    return rows;
  }

  // PUBLIC_INTERFACE
  static async remove(doctor_id, date) {
    /** Deletes schedule for a doctor/date. */
    const db = getDb();
    await db.execute('DELETE FROM schedules WHERE doctor_id = ? AND date = ?', [doctor_id, date]);
    return { success: true };
  }
}

module.exports = ScheduleModel;
