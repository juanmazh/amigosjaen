//rutas de comentarios
const express = require('express');
const router = express.Router();
const { Comentario, Publicacion, Usuario } = require('../models');
const verificarToken = require('../middleware/verificarToken');

// Obtener comentarios de una publicación (con respuestas anidadas)
router.get('/publicacion/:publicacionId', async (req, res) => {
  try {
    const comentarios = await Comentario.findAll({
      where: { publicacionId: req.params.publicacionId, parentId: null },
      include: [
        { model: Usuario, attributes: ['id', 'nombre'] },
        {
          model: Comentario,
          as: 'respuestas',
          include: [{ model: Usuario, attributes: ['id', 'nombre'] }],
        },
      ],
      order: [['createdAt', 'ASC']],
    });
    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});

// Crear comentario o respuesta
router.post('/', verificarToken, async (req, res) => {
  try {
    const { contenido, publicacionId, parentId } = req.body;
    const usuarioId = req.usuario.id;
    const nuevoComentario = await Comentario.create({
      contenido,
      publicacionId,
      usuarioId,
      parentId: parentId || null,
    });
    res.status(201).json(nuevoComentario);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear comentario' });
  }
});

module.exports = router;
