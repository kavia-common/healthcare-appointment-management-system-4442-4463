'use strict';
const PatientService = require('../services/patientService');

class PatientsController {
  // PUBLIC_INTERFACE
  async create(req, res) {
    /** POST /patients */
    try {
      const data = req.body || {};
      if (!data.name || !data.gender) {
        return res.status(400).json({ status: 'error', message: 'Missing required fields' });
      }
      const patient = await PatientService.createPatient(data);
      return res.status(201).json({ status: 'ok', data: patient });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async list(req, res) {
    /** GET /patients */
    try {
      const { q, doctorId, limit, offset } = req.query;
      const patients = await PatientService.listPatients({ q, doctorId, limit, offset });
      return res.status(200).json({ status: 'ok', data: patients });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async get(req, res) {
    /** GET /patients/:id */
    try {
      const id = Number(req.params.id);
      const patient = await PatientService.getPatient(id);
      if (!patient) return res.status(404).json({ status: 'error', message: 'Not found' });
      return res.status(200).json({ status: 'ok', data: patient });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res) {
    /** PUT /patients/:id */
    try {
      const id = Number(req.params.id);
      const data = req.body || {};
      const patient = await PatientService.updatePatient(id, data);
      return res.status(200).json({ status: 'ok', data: patient });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async delete(req, res) {
    /** DELETE /patients/:id */
    try {
      const id = Number(req.params.id);
      await PatientService.deletePatient(id);
      return res.status(200).json({ status: 'ok' });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }
}

module.exports = new PatientsController();
