'use strict';
const ScheduleModel = require('../models/scheduleModel');

const PLAN_TYPES = new Set(['operation', 'outpatient', 'rounds', 'off']);

/**
 * Schedule service validates plan types and ensures structured access.
 */
class ScheduleService {
  // PUBLIC_INTERFACE
  static async upsertSchedule({ doctor_id, date, plan_type, notes }) {
    /** Creates or updates schedule for a doctor. */
    if (!PLAN_TYPES.has(plan_type)) {
      throw new Error('Invalid plan_type');
    }
    return ScheduleModel.upsert({ doctor_id, date, plan_type, notes });
  }

  // PUBLIC_INTERFACE
  static async getSchedule(doctor_id, date) {
    /** Gets a schedule by doctor and date. */
    return ScheduleModel.getByDoctorAndDate(doctor_id, date);
  }

  // PUBLIC_INTERFACE
  static async listSchedules({ doctor_id, start, end }) {
    /** Lists schedules for a doctor by date range. */
    return ScheduleModel.listByDoctor({ doctor_id, start, end });
  }

  // PUBLIC_INTERFACE
  static async deleteSchedule(doctor_id, date) {
    /** Removes a schedule entry. */
    return ScheduleModel.remove(doctor_id, date);
  }
}

module.exports = ScheduleService;
