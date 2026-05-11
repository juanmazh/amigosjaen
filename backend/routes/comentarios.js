//rutas de comentarios
const express = require('express');
const router = express.Router();
const { Comentario, Publicacion, Usuario, Notificacion } = require('../models');
const verificarToken = require('../middleware/verificarToken');
const { emitirAUsuario } = require('../realtime');

// Obtener comentarios de una publicación (con respuestas anidadas)
router.get('/publicacion/:publicacionId', async (req, res) => {
  try {
    const comentarios = await Comentario.findAll({
      where: { publicacionId: req.params.publicacionId, parentId: null },
      include: [
        { model: Usuario, attributes: ['id', 'nombre', 'avatarUrl'] },
        {
          model: Comentario,
          as: 'respuestas',
          include: [{ model: Usuario, attributes: ['id', 'nombre', 'avatarUrl'] }],
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

    // --- Notificaciones ---
    // Datos del autor del comentario (para el mensaje)
    const autor = await Usuario.findByPk(usuarioId, { attributes: ['id', 'nombre'] });

    try {
      let nuevaNotif = null;
      if (parentId) {
        // Respuesta a otro comentario → notificar al autor del comentario padre
        const padre = await Comentario.findByPk(parentId);
        if (padre && padre.usuarioId !== usuarioId) {
          nuevaNotif = await Notificacion.create({
            usuarioId: padre.usuarioId,
            tipo: 'respuesta',
            mensaje: `${autor?.nombre || 'Alguien'} ha respondido a tu comentario`,
            enlaceUrl: `/publicaciones/${publicacionId}`,
          });
        }
      } else {
        // Comentario directo en la publicación → notificar al autor de la publicación
        const publicacion = await Publicacion.findByPk(publicacionId);
        if (publicacion && publicacion.UsuarioId !== usuarioId) {
          nuevaNotif = await Notificacion.create({
            usuarioId: publicacion.UsuarioId,
            tipo: 'comentario',
            mensaje: `${autor?.nombre || 'Alguien'} ha comentado en tu publicación`,
            enlaceUrl: `/publicaciones/${publicacionId}`,
          });
        }
      }
      // Empujar la notificación al destinatario en tiempo real si está conectado
      if (nuevaNotif) emitirAUsuario(nuevaNotif.usuarioId, 'nuevaNotificacion', nuevaNotif);
    } catch (notifErr) {
      // No queremos que un fallo de notificación tire la respuesta del comentario
      console.error('Error creando notificación:', notifErr.message);
    }

    res.status(201).json(nuevoComentario);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear comentario' });
  }
});

module.exports = router;
