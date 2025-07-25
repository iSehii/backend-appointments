const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Doctor = require('./DoctorModel');
const Patient = require('./PacienteModel');

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  scheduled_at: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  jitsi_url: { type: DataTypes.STRING },
  notes: {
    type: DataTypes.JSON,
    allowNull: true
  },
  duration: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 30 }
});

Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = Appointment;