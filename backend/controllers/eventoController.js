const Evento = require("../models/Evento");
const AsistentesEventos = require("../models/AsistentesEventos");
const { Op } = require("sequelize");

// Crear un nuevo evento
const crearEvento = async (req, res) => {
  try {
    const { titulo, descripcion, fecha, imagenes } = req.body;
    const usuarioId = req.usuario.id; // Obtenemos el usuario autenticado

    const nuevoEvento = await Evento.create({
      titulo,
      descripcion,
      fecha,
      imagenes,
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

module.exports = {
  crearEvento,
  listarEventos,
  actualizarEstadoEventos,
  listarEventoPorId,
};