const Evento = require("../models/Evento");
const AsistentesEventos = require("../models/AsistentesEventos");
const { Op } = require("sequelize");

// Crear un nuevo evento
const crearEvento = async (req, res) => {
  try {
    const { titulo, descripcion, fecha, imagenes, localizacion } = req.body;
    const usuarioId = req.usuario.id; // Obtenemos el usuario autenticado

    const nuevoEvento = await Evento.create({
      titulo,
      descripcion,
      fecha,
      imagenes,
      localizacion, // Guardar localización
      usuarioId,
    });

    res.status(201).json(nuevoEvento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el evento" });
  }
};

// Listar eventos
const listarEventos = async (req, res) => {
  try {
    const eventos = await Evento.findAll({
      where: {
        activo: true,
      },
      order: [["fecha", "ASC"]],
    });

    res.status(200).json(eventos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar los eventos" });
  }
};

// Actualizar estado de eventos
const actualizarEstadoEventos = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const evento = await Evento.findByPk(id);

    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    evento.activo = activo;
    await evento.save();

    res.status(200).json(evento);
  } catch (error) {
    console.error("Error al actualizar el estado del evento:", error);
    res.status(500).json({ error: "Error al actualizar el estado del evento" });
  }
};

const listarEventoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);

    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    res.json(evento);
  } catch (error) {
    console.error("Error al obtener el evento:", error);
    res.status(500).json({ error: "Error al obtener el evento" });
  }
};

// Eliminar un evento (solo el dueño puede)
const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);
    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }
    // Solo el dueño puede borrar
    if (evento.usuarioId !== req.usuario.id) {
      return res.status(403).json({ error: "No tienes permiso para borrar este evento" });
    }
    await evento.destroy();
    res.status(200).json({ msg: "Evento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el evento:", error);
    res.status(500).json({ error: "Error al eliminar el evento" });
  }
};

// Inscribir usuario a un evento
const inscribirAsistente = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { id } = req.params; // id del evento
    // Verificar si ya está inscrito
    const yaInscrito = await AsistentesEventos.findOne({ where: { usuarioId, eventoId: id } });
    if (yaInscrito) {
      return res.status(400).json({ error: "Ya estás inscrito en este evento" });
    }
    await AsistentesEventos.create({ usuarioId, eventoId: id });
    res.status(201).json({ msg: "Inscripción exitosa" });
  } catch (error) {
    console.error("Error al inscribirse al evento:", error);
    res.status(500).json({ error: "Error al inscribirse al evento" });
  }
};

// Obtener asistentes de un evento
const obtenerAsistentes = async (req, res) => {
  try {
    const { id } = req.params; // id del evento
    const asistentes = await AsistentesEventos.findAll({
      where: { eventoId: id },
      include: [{ model: require("../models/Usuario"), attributes: ["id", "nombre", "email"] }],
    });
    res.json(asistentes.map(a => a.Usuario));
  } catch (error) {
    console.error("Error al obtener asistentes:", error);
    res.status(500).json({ error: "Error al obtener asistentes" });
  }
};

// Eliminar un asistente de un evento (solo el creador puede)
const eliminarAsistente = async (req, res) => {
  try {
    const { id, usuarioId } = req.params; // id = eventoId
    // Verificar que el usuario autenticado es el creador del evento
    const evento = await Evento.findByPk(id);
    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }
    if (evento.usuarioId !== req.usuario.id) {
      return res.status(403).json({ error: "No tienes permiso para eliminar asistentes de este evento" });
    }
    // Buscar y eliminar la relación
    const eliminado = await AsistentesEventos.destroy({ where: { eventoId: id, usuarioId } });
    if (!eliminado) {
      return res.status(404).json({ error: "Asistente no encontrado en este evento" });
    }
    res.status(200).json({ msg: "Asistente eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar asistente:", error);
    res.status(500).json({ error: "Error al eliminar asistente" });
  }
};

module.exports = {
  crearEvento,
  listarEventos,
  actualizarEstadoEventos,
  listarEventoPorId,
  eliminarEvento,
  inscribirAsistente,
  obtenerAsistentes,
  eliminarAsistente,
};