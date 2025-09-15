'use strict';
const PatientModel = require('../models/patientModel');

/**
 * Patient service for nurse-facing CRUD.
 */
class PatientService {
  // PUBLIC_INTERFACE
  static async createPatient(data) {
    /** Creates a patient record. */
    return PatientModel.create(data);
  }

  // PUBLIC_INTERFACE
  static async getPatient(id) {
    /** Gets a patient by id. */
    return PatientModel.findById(id);
  }

  // PUBLIC_INTERFACE
  static async listPatients(filters) {
    /** Lists patients with filters. */
    return PatientModel.list(filters);
  }

  // PUBLIC_INTERFACE
  static async updatePatient(id, data) {
    /** Updates patient fields. */
    return PatientModel.update(id, data);
  }

  // PUBLIC_INTERFACE
  static async deletePatient(id) {
    /** Deletes a patient by id. */
    return PatientModel.remove(id);
  }
}

module.exports = PatientService;
