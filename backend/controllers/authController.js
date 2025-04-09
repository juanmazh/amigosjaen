const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) return res.status(400).json({ msg: 'El email ya está registrado' });

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseñaHash = await bcrypt.hash(contraseña, salt);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({ nombre, email, contraseña: contraseñaHash });

    res.json({ msg: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(400).json({ msg: 'Usuario no encontrado' });

    const esCorrecta = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esCorrecta) return res.status(400).json({ msg: 'Contraseña incorrecta' });

    // Generar token JWT
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, usuario });
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Obtener usuario autenticado
exports.getUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, { attributes: { exclude: ['contraseña'] } });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};
