const express = require('express');
const bodyParser = require('body-parser');
require('./models/DoctorModel');
require('./models/PacienteModel');
require('./models/Appointment');
const morgan = require('morgan');
const routes = require('./routes');
const sequelize = require('./config/db');
const port = process.env.PORT || 3000;
const app = express();
const cors = require('cors');
require('dotenv').config();

const expressListEndpoints = require('express-list-endpoints');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan('dev'));
app.use('/', require('./routes/index'));
console.log(expressListEndpoints(app));

sequelize.sync({ alter: true }).then(() => {
  console.log('Tablas sincronizadas');
  app.listen(port, () => console.log(`Servidor iniciado en puerto ${port}`));
});