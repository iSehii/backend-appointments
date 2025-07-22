const express = require('express');
const router = express.Router();
router.use(express.json());

const {
  getAppointments,
  getPatients,
  createInstantAppointment,
  createScheduledAppointment
} = require('../controllers/indexControllers');

router.get('/api/appointments', getAppointments);
router.get('/api/patients', getPatients);
router.post('/api/appointments', createInstantAppointment);
router.post('/api/schedule', createScheduledAppointment);

module.exports = router;