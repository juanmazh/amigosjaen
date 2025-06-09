const { MensajeDirecto, Usuario } = require('../models');
const { Op } = require('sequelize');

// Enviar un mensaje directo
exports.enviarMensaje = async (req, res) => {
  try {
    const { destinatarioId, contenido } = req.body;
    const remitenteId = req.usuario.id;

    if (!destinatarioId || !contenido) {
      return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }

    // Verifica que el usuario destinatario existe
    const destinatario = await Usuario.findByPk(destinatarioId);
    if (!destinatario) {
      return res.status(404).json({ error: 'Destinatario no encontrado.' });
    }

    // Crea el mensaje
    const mensaje = await MensajeDirecto.create({
      remitenteId,
      destinatarioId,
      contenido,
      leido: false,
    });
    res.status(201).json(mensaje);
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el mensaje.' });
  }
};

// Obtener historial de mensajes entre dos usuarios, logs de chat
exports.obtenerHistorial = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const otroUsuarioId = req.params.otroUsuarioId;

    // Busca los mensajes entre ambos usuarios
    const mensajes = await MensajeDirecto.findAll({
      where: {
        [Op.or]: [
          { remitenteId: usuarioId, destinatarioId: otroUsuarioId },
          { remitenteId: otroUsuarioId, destinatarioId: usuarioId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });

    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el historial.' });
  }
};

// Marcar mensajes como leídos
exports.marcarComoLeido = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const remitenteId = req.body.remitenteId;

    await MensajeDirecto.update(
      { leido: true },
      {
        where: {
          remitenteId,
          destinatarioId: usuarioId,
          leido: false,
        },
      }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al marcar como leído.' });
  }
};

// Obtener el último mensaje de cada conversación del usuario (como remitente o destinatario)
exports.obtenerConversaciones = async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);
    // Buscar todos los mensajes donde el usuario es remitente o destinatario
    const mensajes = await MensajeDirecto.findAll({
      where: {
        [Op.or]: [
          { remitenteId: usuarioId },
          { destinatarioId: usuarioId },
        ],
      },
      order: [['createdAt', 'DESC']],
      include: [
        { model: Usuario, as: 'remitente', attributes: ['id', 'nombre', 'email'] },
        { model: Usuario, as: 'destinatario', attributes: ['id', 'nombre', 'email'] },
      ],
    });

    // Agrupar por el otro usuario (el que no es el usuarioId)
    const conversaciones = {};
    for (const msg of mensajes) {
      // Determinar el otro participante
      const otroUsuario =
        msg.remitenteId === usuarioId ? msg.destinatario : msg.remitente;
      const otroUsuarioId = otroUsuario.id;
      // Solo guardar el primer mensaje encontrado (el más reciente)
      if (!conversaciones[otroUsuarioId]) {
        conversaciones[otroUsuarioId] = {
          usuario: otroUsuario,
          mensaje: msg,
        };
      }
    }
    // Devolver como array ordenado por fecha descendente
    const resultado = Object.values(conversaciones).sort(
      (a, b) => new Date(b.mensaje.createdAt) - new Date(a.mensaje.createdAt)
    );
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las conversaciones.' });
  }
};
