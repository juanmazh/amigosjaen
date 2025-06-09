//rutas de etiquetas
const express = require('express');
const router = express.Router();
const Etiqueta = require('../models/Etiqueta');

// Obtener todas las etiquetas
router.get('/', async (req, res) => {
  try {
    const etiquetas = await Etiqueta.findAll();
    res.json(etiquetas);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener etiquetas' });
  }
});

module.exports = router;