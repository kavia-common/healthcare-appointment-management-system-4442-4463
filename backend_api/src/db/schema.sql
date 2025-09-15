-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','doctor','nurse') NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  place VARCHAR(160),
  date_of_birth DATE,
  reason_for_visit VARCHAR(255),
  gender ENUM('male','female','other') NOT NULL,
  assigned_doctor_id INT,
  fees_collected DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  CONSTRAINT fk_patients_doctor FOREIGN KEY (assigned_doctor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Schedules table
CREATE TABLE IF NOT EXISTS schedules (
  doctor_id INT NOT NULL,
  date DATE NOT NULL,
  plan_type ENUM('operation','outpatient','rounds','off') NOT NULL,
  notes VARCHAR(255),
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (doctor_id, date),
  CONSTRAINT fk_schedules_doctor FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_time DATETIME NOT NULL,
  reason VARCHAR(255),
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  UNIQUE KEY uk_doctor_time (doctor_id, appointment_time),
  CONSTRAINT fk_appointments_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
);
