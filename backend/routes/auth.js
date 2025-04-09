const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");  // Importa el modelo
require("dotenv").config();

const router = express.Router();

// Registro de usuario
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await Usuario.create({ nombre, email, password: hashedPassword });

    res.json({ message: "Usuario registrado correctamente", usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ error: "Error en el registro", detalle: error.message });
  }
});

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
