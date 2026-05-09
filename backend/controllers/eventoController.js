const { Evento, Etiqueta } = require("../models");
const AsistentesEventos = require("../models/AsistentesEventos");
const { Op } = require("sequelize");

// Crear un nuevo evento
const crearEvento = async (req, res) => {
  const t = await Evento.sequelize.transaction();
  try {
    const { titulo, descripcion, fecha, imagenes, localizacion, etiquetas = [] } = req.body;
    const usuarioId = req.usuario.id; // Obtenemos el usuario autenticado

    const nuevoEvento = await Evento.create({
      titulo,
      descripcion,
      fecha,
      imagenes,
      localizacion, 
      usuarioId,
    }, { transaction: t });

    // Asociar etiquetas si vienen en el body
    if (Array.isArray(etiquetas) && etiquetas.length > 0) {
      const etiquetasFiltradas = etiquetas
        .map(e => (typeof e === 'string' ? e.trim() : ''))
        .filter(e => e.length > 0);
      if (etiquetasFiltradas.length > 0) {
        const etiquetasCreadas = await Promise.all(
          etiquetasFiltradas.map(async (nombre) => {
            const [etiqueta, created] = await Etiqueta.findOrCreate({ where: { nombre }, transaction: t });
            console.log('Etiqueta:', etiqueta.nombre, 'ID:', etiqueta.id, 'Creada:', created);
            return etiqueta;
          })
        );
        console.log('Etiquetas a asociar (IDs):', etiquetasCreadas.map(e => e.id));
        await nuevoEvento.addEventosTags(etiquetasCreadas, { transaction: t });
      }
    }

    await t.commit();

    // Devolver el evento con las etiquetas asociadas
    const eventoConEtiquetas = await Evento.findByPk(nuevoEvento.id, {
      include: [{ model: Etiqueta, as: "eventosTags" }],
    });

    res.status(201).json(eventoConEtiquetas);
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: "Error al crear el evento" });
  }
};

// Listar eventos (con etiquetas)
const listarEventos = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0,0,0,0); // Solo fecha, sin hora
    const maniana = new Date(hoy);
    maniana.setDate(hoy.getDate() + 1); // Siguiente día a las 00:00
    const eventos = await Evento.findAll({
      where: {
        activo: true,
        fecha: { [Op.gte]: hoy }, // Incluye hoy y futuros, importante para no mostrar eventos pasados
      },
      include: [{ model: Etiqueta, as: "eventosTags" }],
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

// Obtener detalles de un evento concreto (con etiquetas)
const listarEventoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id, {
      include: [{ model: Etiqueta, as: "eventosTags" }],
    });

    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    res.json(evento);
  } catch (error) {
    console.error("Error al obtener el evento:", error);
    res.status(500).json({ error: "Error al obtener el evento" });
  }
};

// Eliminar un evento (dueño o admin)
const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);
    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }
    // Permitir si es el dueño o admin
    if (evento.usuarioId !== req.usuario.id && req.usuario.rol !== 'admin') {
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
    const { id, usuarioId } = req.params; // id eventoId
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

// Actualizar un evento (dueño o admin)
const updateEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, fecha, imagenes, localizacion, activo, etiquetas = [] } = req.body;
    const evento = await Evento.findByPk(id, { include: [{ model: Etiqueta, as: "eventosTags" }] });
    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }
    // Permitir si es el dueño o admin
    if (evento.usuarioId !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: "No tienes permiso para editar este evento" });
    }
    // Actualizar campos
    if (titulo !== undefined) evento.titulo = titulo;
    if (descripcion !== undefined) evento.descripcion = descripcion;
    if (fecha !== undefined) evento.fecha = fecha;
    if (imagenes !== undefined) evento.imagenes = imagenes;
    if (localizacion !== undefined) evento.localizacion = localizacion;
    if (activo !== undefined) evento.activo = activo;
    await evento.save();
    // Actualizar etiquetas si se proporcionan
    if (Array.isArray(etiquetas)) {
      const etiquetasCreadas = await Promise.all(
        etiquetas.map(async (nombre) => {
          const [etiqueta] = await Etiqueta.findOrCreate({ where: { nombre } });
          return etiqueta;
        })
      );
      await evento.setEventosTags(etiquetasCreadas);
    }
    // Devolver el evento actualizado con etiquetas
    const eventoActualizado = await Evento.findByPk(id, { include: [{ model: Etiqueta, as: "eventosTags" }] });
    res.status(200).json(eventoActualizado);
  } catch (error) {
    console.error("Error al actualizar el evento:", error);
    res.status(500).json({ error: "Error al actualizar el evento" });
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
  updateEvento,
};