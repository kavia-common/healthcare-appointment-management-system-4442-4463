const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Healthcare Appointment Management API',
      version: '1.0.0',
      description: 'Backend API for authentication, patient management, appointments, and doctor schedules.',
    },
    tags: [
      { name: 'Auth', description: 'Authentication' },
      { name: 'Users', description: 'User management' },
      { name: 'Patients', description: 'Patient management' },
      { name: 'Schedules', description: 'Doctor daily schedules' },
      { name: 'Appointments', description: 'Appointments' },
      { name: 'Health', description: 'Healthcheck' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
