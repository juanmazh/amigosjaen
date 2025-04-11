const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secretoSuperSeguro'; // Idealmente usa una variable de entorno

exports.register = async (req, res) => {
  const { nombre, email, contraseña } = req.body;

  // Validación básica de los campos
  if (!nombre || !email || !contraseña) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si ya existe el usuario
    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseñaHasheada = await bcrypt.hash(contraseña, salt);

    // Crear el nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      contraseña: contraseñaHasheada,
    });

    // Crear el token JWT
    const payload = { id: nuevoUsuario.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // Enviar la respuesta con el token y el usuario
    res.json({
      token,
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al registrar usuario', error });
  }
};
