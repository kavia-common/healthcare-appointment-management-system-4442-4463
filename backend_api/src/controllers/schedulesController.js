'use strict';
const ScheduleService = require('../services/scheduleService');

class SchedulesController {
  // PUBLIC_INTERFACE
  async upsert(req, res) {
    /** PUT /schedules */
    try {
      const { doctor_id, date, plan_type, notes } = req.body || {};
      if (!doctor_id || !date || !plan_type) {
        return res.status(400).json({ status: 'error', message: 'Missing fields' });
      }
      const schedule = await ScheduleService.upsertSchedule({ doctor_id, date, plan_type, notes });
      return res.status(200).json({ status: 'ok', data: schedule });
    } catch (e) {
      return res.status(400).json({ status: 'error', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async get(req, res) {
    /** GET /schedules/:doctorId/:date */
    try {
      const { doctorId, date } = req.params;
      const schedule = await ScheduleService.getSchedule(Number(doctorId), date);
      if (!schedule) return res.status(404).json({ status: 'error', message: 'Not found' });
      return res.status(200).json({ status: 'ok', data: schedule });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async listByDoctor(req, res) {
    /** GET /schedules/:doctorId?start=YYYY-MM-DD&end=YYYY-MM-DD */
    try {
      const doctor_id = Number(req.params.doctorId);
      const { start, end } = req.query;
      const data = await ScheduleService.listSchedules({ doctor_id, start, end });
      return res.status(200).json({ status: 'ok', data });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async remove(req, res) {
    /** DELETE /schedules/:doctorId/:date */
    try {
      const { doctorId, date } = req.params;
      await ScheduleService.deleteSchedule(Number(doctorId), date);
      return res.status(200).json({ status: 'ok' });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }
}

module.exports = new SchedulesController();
