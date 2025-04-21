const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Usuario = require('../models/Usuario');

// Obtener todos los usuarios (solo para admin)
router.get('/', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuarioId);

    if (usuario.rol !== 'admin') {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }

    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'email', 'rol']
    });

    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los usuarios' });
  }
});

module.exports = router;
