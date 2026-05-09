const { Valoracion, Evento } = require('../models');

// Crear o actualizar una valoración
exports.guardarValoracion = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { eventoId, valor, comentario } = req.body;
    if (!eventoId || !valor) {
      return res.status(400).json({ msg: 'Evento y valor son obligatorios' });
    }
    // Solo puede valorar si asistió al evento
    const evento = await Evento.findByPk(eventoId);
    if (!evento) return res.status(404).json({ msg: 'Evento no encontrado' });
    // Buscar si ya existe una valoración
    let valoracion = await Valoracion.findOne({ where: { usuarioId, eventoId } });
    if (valoracion) {
      valoracion.valor = valor;
      valoracion.comentario = comentario;
      await valoracion.save();
    } else {
      valoracion = await Valoracion.create({ usuarioId, eventoId, valor, comentario });
    }
    res.json({ valoracion });
  } catch (error) {
    res.status(500).json({ msg: 'Error al guardar la valoración' });
  }
};

// Obtener la valoración de un usuario para un evento 
exports.obtenerValoracion = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { eventoId } = req.params;
    const valoracion = await Valoracion.findOne({ where: { usuarioId, eventoId } });
    res.json({ valoracion });
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener la valoración' });
  }
};
