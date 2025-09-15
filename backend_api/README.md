# Backend API

Express-based API for Healthcare Appointment Management.

## Setup

- Copy .env.example to .env and set values:
  - JWT_SECRET
  - MySQL connection (MYSQL_URL or MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB, MYSQL_PORT)
- Install deps: npm install
- Ensure database schema is created (see src/db/schema.sql)

## Run

- Development: npm run dev
- Production: npm start
- Docs: /docs

## API Overview

- Auth
  - POST /auth/login
- Users (admin)
  - GET /users
  - POST /users
  - GET /users/:id
  - PUT /users/:id
  - DELETE /users/:id
- Patients (nurse/admin, read for doctor)
  - GET /patients
  - POST /patients
  - GET /patients/:id
  - PUT /patients/:id
  - DELETE /patients/:id
- Schedules
  - PUT /schedules
  - GET /schedules/:doctorId/:date
  - GET /schedules/:doctorId?start=YYYY-MM-DD&end=YYYY-MM-DD
  - DELETE /schedules/:doctorId/:date
- Appointments
  - GET /appointments
  - POST /appointments
  - GET /appointments/:id
  - PUT /appointments/:id
  - DELETE /appointments/:id

## Notes

- Roles: admin | doctor | nurse
- Nurses can create appointments after verifying doctor schedule.
- Appointment creation validates doctor availability (not off/operation).
