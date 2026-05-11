//rutas para autenticación de usuarios
const express = require("express");
const authMiddleware = require("../middleware/auth.js"); // para verificar el token
const authController = require('../controllers/authController');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");  // Importa el modelo
require("dotenv").config();
const router = express.Router();

router.get('/usuario', authMiddleware, authController.obtenerUsuario);  // Añadimos la ruta para obtener el usuario

// Registro de usuario
router.post('/register', authController.register);

// Login de usuario
router.post('/login', authController.login);

// Actualizar perfil propio (nombre, avatarUrl)
router.put('/perfil', authMiddleware, async (req, res) => {
  try {
    const { nombre, avatarUrl } = req.body;
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

    if (typeof nombre === 'string' && nombre.trim()) usuario.nombre = nombre.trim();
    if (typeof avatarUrl === 'string') usuario.avatarUrl = avatarUrl.trim() || null;
    await usuario.save();

    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      avatarUrl: usuario.avatarUrl,
      createdAt: usuario.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el perfil' });
  }
});

module.exports = router;
