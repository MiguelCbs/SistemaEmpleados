// api.js
const express = require('express');
const router = express.Router();
const Empleado = require('./db'); // Importa el modelo definido anteriormente

// Define las rutas y maneja las operaciones CRUD aquí

// Ejemplo de una ruta GET para obtener todos los empleados
router.get('/empleados', async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al obtener los empleados.' });
  }
});

// Otras rutas (POST, PUT, DELETE) pueden definirse de manera similar

module.exports = router;