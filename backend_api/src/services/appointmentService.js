'use strict';
const AppointmentModel = require('../models/appointmentModel');
const ScheduleService = require('./scheduleService');

/**
 * Appointment service that ensures the doctor is not off and has a schedule that allows booking.
 */
class AppointmentService {
  // PUBLIC_INTERFACE
  static async createAppointment({ patient_id, doctor_id, appointment_time, reason }) {
    /** Validates schedule and creates appointment. */
    const dateOnly = new Date(appointment_time);
    const dateStr = dateOnly.toISOString().substring(0, 10);
    const schedule = await ScheduleService.getSchedule(doctor_id, dateStr);
    if (!schedule) {
      throw new Error('Doctor schedule not set for this date');
    }
    if (schedule.plan_type === 'off' || schedule.plan_type === 'operation') {
      throw new Error('Doctor not available for appointments on this date');
    }

    // Additional complex availability validations can be added here
    return AppointmentModel.create({ patient_id, doctor_id, appointment_time, reason });
  }

  // PUBLIC_INTERFACE
  static async getAppointment(id) {
    /** Returns appointment by id. */
    return AppointmentModel.findById(id);
  }

  // PUBLIC_INTERFACE
  static async listAppointments(filters) {
    /** Lists appointments by filters. */
    return AppointmentModel.list(filters);
  }

  // PUBLIC_INTERFACE
  static async updateAppointment(id, fields) {
    /** Updates appointment after basic validation. */
    if (fields.appointment_time || fields.doctor_id) {
      const doctorId = fields.doctor_id;
      const time = fields.appointment_time;
      if (doctorId && time) {
        const dateStr = new Date(time).toISOString().substring(0, 10);
        const schedule = await ScheduleService.getSchedule(doctorId, dateStr);
        if (!schedule || schedule.plan_type === 'off' || schedule.plan_type === 'operation') {
          throw new Error('Doctor not available for new appointment time');
        }
      }
    }
    return AppointmentModel.update(id, fields);
  }

  // PUBLIC_INTERFACE
  static async deleteAppointment(id) {
    /** Deletes appointment. */
    return AppointmentModel.remove(id);
  }
}

module.exports = AppointmentService;
