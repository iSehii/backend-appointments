const express = require('express');
const router = express.Router();
router.use(express.json());

const {
  getAppointments,
  getPatients,
  createInstantAppointment,
  createScheduledAppointment,
  createNote,
  deleteAppointment
} = require('../controllers/indexControllers');

router.get('/api/appointments', getAppointments);
router.delete('/api/appointments/:id', deleteAppointment);
router.get('/api/patients', getPatients);
router.post('/api/note/:id', createNote);
router.post('/api/appointments', createInstantAppointment);
router.post('/api/schedule', createScheduledAppointment);

module.exports = router;