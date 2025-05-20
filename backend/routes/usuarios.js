const express = require('express');
const bcrypt = require('bcryptjs'); // Usar bcryptjs en vez de bcrypt
const router = express.Router();
const Usuario = require('../models/Usuario');
const verificarToken = require('../middleware/verificarToken');
const soloAdmin = require('../middleware/soloAdmin');

// Obtener todos los usuarios (solo admin)
router.get('/', verificarToken, soloAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'email', 'rol']
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los usuarios' });
  }
});

// Eliminar un usuario (solo admin)
router.delete('/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

    await usuario.destroy();
    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el usuario' });
  }
});

// Actualizar un usuario (solo admin)
router.put('/:id', verificarToken, soloAdmin, async (req, res) => {
  const { nombre, email, rol } = req.body;
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;
    usuario.rol = rol || usuario.rol;
    await usuario.save();

    res.json({ msg: 'Usuario actualizado', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el usuario' });
  }
});

// Crear un nuevo usuario (solo admin)
router.post('/', verificarToken, soloAdmin, async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ msg: 'Ya existe un usuario con ese email' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      contraseña: hashedPassword, // Cambiado de 'password' a 'contraseña'
      rol,
    });

    // Devolvemos el usuario sin la contraseña
    const { password: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();

    res.status(201).json({ usuario: usuarioSinPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear el usuario' });
  }
});

module.exports = router;
