const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");  // Importa el modelo
require("dotenv").config();
const authController = require('../controllers/authController');

const router = express.Router();

// Registro de usuario
router.post('/register', authController.register);


// Login de usuario 
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ error: "Error en el login", detalle: error.message });
  }
});

module.exports = router;
