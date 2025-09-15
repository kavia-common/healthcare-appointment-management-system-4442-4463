'use strict';
const AppointmentService = require('../services/appointmentService');

class AppointmentsController {
  // PUBLIC_INTERFACE
  async create(req, res) {
    /** POST /appointments */
    try {
      const { patient_id, doctor_id, appointment_time, reason } = req.body || {};
      if (!patient_id || !doctor_id || !appointment_time) {
        return res.status(400).json({ status: 'error', message: 'Missing fields' });
      }
      const appt = await AppointmentService.createAppointment({ patient_id, doctor_id, appointment_time, reason });
      return res.status(201).json({ status: 'ok', data: appt });
    } catch (e) {
      return res.status(400).json({ status: 'error', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async list(req, res) {
    /** GET /appointments */
    try {
      const { doctorId, patientId, start, end, limit, offset } = req.query;
      const appts = await AppointmentService.listAppointments({ doctorId, patientId, start, end, limit, offset });
      return res.status(200).json({ status: 'ok', data: appts });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async get(req, res) {
    /** GET /appointments/:id */
    try {
      const id = Number(req.params.id);
      const appt = await AppointmentService.getAppointment(id);
      if (!appt) return res.status(404).json({ status: 'error', message: 'Not found' });
      return res.status(200).json({ status: 'ok', data: appt });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res) {
    /** PUT /appointments/:id */
    try {
      const id = Number(req.params.id);
      const appt = await AppointmentService.updateAppointment(id, req.body || {});
      return res.status(200).json({ status: 'ok', data: appt });
    } catch (e) {
      return res.status(400).json({ status: 'error', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async delete(req, res) {
    /** DELETE /appointments/:id */
    try {
      const id = Number(req.params.id);
      await AppointmentService.deleteAppointment(id);
      return res.status(200).json({ status: 'ok' });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }
}

module.exports = new AppointmentsController();
