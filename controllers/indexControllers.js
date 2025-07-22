const Appointment = require('../models/Appointment');
const Doctor = require('../models/DoctorModel');
const Patient = require('../models/PacienteModel');

// GET /api/appointments?email=...
exports.getAppointments = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const patient = await Patient.findOne({ where: { email } });
  if (!patient) return res.json([]);
  const appointments = await Appointment.findAll({
    where: { patientId: patient.id },
    include: [Doctor, Patient]
  });
  res.json(appointments);
};

// GET /api/patients?doctor_email=...
exports.getPatients = async (req, res) => {
  const { doctor_email } = req.query;
  if (!doctor_email) {
    return res.status(400).json({ error: 'doctor_email is required' });
  }
  const doctor = await Doctor.findOne({ where: { email: doctor_email } });
  if (!doctor) return res.json([]);
  const appointments = await Appointment.findAll({
    where: { doctorId: doctor.id },
    include: [Patient]
  });
  const patients = appointments.map(a => a.Patient);
  res.json(patients);
};

// POST /api/appointments
exports.createInstantAppointment = async (req, res) => {
  const { doctor_email, patient_email, scheduled_at } = req.body;
  if (!doctor_email || !patient_email) {
    return res.status(400).json({ error: 'doctor_email and patient_email are required' });
  }
  const doctor = await Doctor.findOrCreate({ where: { email: doctor_email }, defaults: { name: doctor_email } });
  const patient = await Patient.findOrCreate({ where: { email: patient_email }, defaults: { name: patient_email } });
  const jitsi_url = `https://meet.jit.si/doctoramigo-${Math.floor(Math.random()*100000)}`;
  const appointment = await Appointment.create({
    scheduled_at,
    status: "instant",
    jitsi_url,
    doctorId: doctor[0].id,
    patientId: patient[0].id
  });
  res.json(appointment);
};

// POST /api/schedule
exports.createScheduledAppointment = async (req, res) => {
  const { doctor_email, patient_email, scheduled_at, notes } = req.body;
  if (!doctor_email || !patient_email) {
    return res.status(400).json({ error: 'doctor_email and patient_email are required' });
  }
  const doctor = await Doctor.findOrCreate({ where: { email: doctor_email }, defaults: { name: doctor_email } });
  const patient = await Patient.findOrCreate({ where: { email: patient_email }, defaults: { name: patient_email } });
  const appointment = await Appointment.create({
    scheduled_at,
    status: "scheduled",
    notes,
    doctorId: doctor[0].id,
    patientId: patient[0].id
  });
  res.json(appointment);
};