// Rutas para gestionar notificaciones del usuario autenticado
const express = require('express');
const router = express.Router();
const { Notificacion } = require('../models');
const verificarToken = require('../middleware/verificarToken');

// Listar notificaciones del usuario logueado (más recientes primero)
router.get('/', verificarToken, async (req, res) => {
  try {
    const notificaciones = await Notificacion.findAll({
      where: { usuarioId: req.usuario.id },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    res.json(notificaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener notificaciones' });
  }
});

// Contar notificaciones no leídas (útil para el badge del header)
router.get('/no-leidas', verificarToken, async (req, res) => {
  try {
    const total = await Notificacion.count({
      where: { usuarioId: req.usuario.id, leida: false },
    });
    res.json({ total });
  } catch (error) {
    res.status(500).json({ msg: 'Error al contar notificaciones' });
  }
});

// Marcar una notificación como leída
router.patch('/:id/leer', verificarToken, async (req, res) => {
  try {
    const n = await Notificacion.findOne({
      where: { id: req.params.id, usuarioId: req.usuario.id },
    });
    if (!n) return res.status(404).json({ msg: 'Notificación no encontrada' });
    n.leida = true;
    await n.save();
    res.json(n);
  } catch (error) {
    res.status(500).json({ msg: 'Error al marcar como leída' });
  }
});

// Marcar todas como leídas
router.patch('/leer-todas', verificarToken, async (req, res) => {
  try {
    await Notificacion.update(
      { leida: true },
      { where: { usuarioId: req.usuario.id, leida: false } }
    );
    res.json({ msg: 'Todas marcadas como leídas' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al marcar todas' });
  }
});

// Eliminar una notificación
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const eliminadas = await Notificacion.destroy({
      where: { id: req.params.id, usuarioId: req.usuario.id },
    });
    if (!eliminadas) return res.status(404).json({ msg: 'Notificación no encontrada' });
    res.json({ msg: 'Eliminada' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar' });
  }
});

module.exports = router;
