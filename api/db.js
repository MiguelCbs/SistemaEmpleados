const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/empleadosDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const empleadoSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  telefono: String,
  direccion: String,
});

const Empleado = mongoose.model('Empleado', empleadoSchema);

module.exports = Empleado; // Exporta el modelo para su uso en otras partes del proyecto