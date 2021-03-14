const Servidor = require('./modelos/servidor');

require('dotenv').config();
const servidor = new Servidor();
servidor.escuchar();