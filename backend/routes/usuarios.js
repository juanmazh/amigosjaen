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

router.delete('/:id', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

    await usuario.destroy();
    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar el usuario' });
  }
});

router.put('/:id', auth, async (req, res) => {
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
    res.status(500).json({ msg: 'Error al actualizar el usuario' });
  }
});


module.exports = router;
