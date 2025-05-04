const express = require('express');
const router = express.Router();
const Publicacion = require('../models/Publicacion');
const Usuario = require('../models/Usuario');

router.get('/', async (req, res) => {
  try {
    const publicaciones = await Publicacion.findAll({
      include: {
        model: Usuario,
        attributes: ['nombre'],
      },
      order: [['createdAt', 'DESC']]
    });

    const formateadas = publicaciones.map(pub => ({
      id: pub.id,
      titulo: pub.titulo,
      contenido: pub.contenido,
      autorNombre: pub.Usuario.nombre,
    }));

    res.json(formateadas);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener publicaciones' });
  }
});

// Ruta para obtener una publicación por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const publicacion = await Publicacion.findOne({
      where: { id },
      include: {
        model: Usuario,
        attributes: ['nombre'],
      },
    });

    if (!publicacion) {
      return res.status(404).json({ msg: 'Publicación no encontrada' });
    }

    const detalle = {
      id: publicacion.id,
      titulo: publicacion.titulo,
      contenido: publicacion.contenido,
      autorNombre: publicacion.Usuario.nombre,
      etiquetas: publicacion.etiquetas,
    };

    res.json(detalle);
  } catch (err) {
    console.error('Error al obtener la publicación:', err);
    res.status(500).json({ msg: 'Error al obtener la publicación' });
  }
});

// Ruta para crear una publicación (requiere autenticación)
router.post('/', async (req, res) => {
  try {
    const { titulo, contenido, usuarioId } = req.body;

    if (!titulo || !contenido || !usuarioId) {
      return res.status(400).json({ msg: 'Faltan campos requeridos' });
    }

    const publicacion = await Publicacion.create({
      titulo,
      contenido,
      UsuarioId: usuarioId,
    });

    res.status(201).json(publicacion);
  } catch (err) {
    console.error('Error al crear publicación:', err);
    res.status(500).json({ msg: 'Error al crear publicación' });
  }
});

module.exports = router;
