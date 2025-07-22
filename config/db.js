require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
  }
);
sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos exitosa'))
  .catch(err => console.error('Error de conexión a la base de datos:', err));

module.exports = sequelize;