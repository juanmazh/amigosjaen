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


module.exports = router;
