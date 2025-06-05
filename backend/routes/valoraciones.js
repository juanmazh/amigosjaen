const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/verificarToken');
const valoracionController = require('../controllers/valoracionController');

// Guardar o actualizar valoración
router.post('/', verificarToken, valoracionController.guardarValoracion);
// Obtener valoración de un usuario para un evento
router.get('/:eventoId', verificarToken, valoracionController.obtenerValoracion);

module.exports = router;
