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
    include: [Doctor, Patient], order: [['scheduled_at', 'DESC']]
  });
  // Formatear igual que en la creación: incluir doctor como objeto anidado
  const formatted = appointments.map(a => {
    const obj = a.toJSON();
    return {
      ...obj,
      doctor: obj.Doctor,
      patient: obj.Patient
    };
  });
  res.json(formatted);
};

exports.createNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ error: 'Note is required' });
    }

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await appointment.update({ notes: note });

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
    include: [Patient, Doctor]
  });
  // Formatear igual que en getAppointments: incluir patient y doctor como objetos anidados
  const formatted = appointments.map(a => {
    const obj = a.toJSON();
    return {
      ...obj,
      patient: obj.Patient,
      doctor: obj.Doctor
    };
  });
  res.json(formatted);
};

// POST /api/appointments
exports.createInstantAppointment = async (req, res) => {
  const { doctor_email, patient_email, scheduled_at, duration } = req.body;
  if (!doctor_email || !patient_email) {
    return res.status(400).json({ error: 'doctor_email and patient_email are required' });
  }
  const doctor = await Doctor.findOrCreate({ where: { email: doctor_email }, defaults: { name: doctor_email } });
  const patient = await Patient.findOrCreate({ where: { email: patient_email }, defaults: { name: patient_email } });
  const jitsi_url = `https://meet.gahandi.dev/${Math.floor(Math.random()*100000)}`;
  const appointment = await Appointment.create({
    scheduled_at,
    status: "instant",
    jitsi_url,
    doctorId: doctor[0].id,
    patientId: patient[0].id,
    duration: duration || 30
  });
  // Obtener datos completos del doctor
  const doctorData = doctor[0].toJSON();
  res.json({ ...appointment.toJSON(), doctor: doctorData });
};

// POST /api/schedule
exports.createScheduledAppointment = async (req, res) => {
  const { doctor_email, patient_email, scheduled_at, notes, duration } = req.body;
  if (!doctor_email || !patient_email) {
    return res.status(400).json({ error: 'doctor_email and patient_email are required' });
  }
  const doctor = await Doctor.findOrCreate({ where: { email: doctor_email }, defaults: { name: doctor_email } });
  const patient = await Patient.findOrCreate({ where: { email: patient_email }, defaults: { name: patient_email } });
  const jitsi_url = `https://meet.gahandi.dev/${Math.floor(Math.random()*100000)}`;
  const appointment = await Appointment.create({
    scheduled_at,
    status: "scheduled",
    notes,
    doctorId: doctor[0].id,
    patientId: patient[0].id,
    duration: duration || 30,
    jitsi_url
  });
  // Obtener datos completos del doctor
  const doctorData = doctor[0].toJSON();
  res.json({ ...appointment.toJSON(), doctor: doctorData });
};

exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findByPk(id);
  if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
  await appointment.destroy();
  res.json({ message: 'Appointment deleted' });
};