//rutas para manejar lo que pueden hacer los usuarios en la aplicación
const express = require('express');
const bcrypt = require('bcryptjs'); // Usar bcryptjs en vez de bcrypt
const router = express.Router();
const Usuario = require('../models/Usuario');
const verificarToken = require('../middleware/verificarToken');
const soloAdmin = require('../middleware/soloAdmin');
const { Seguidores, Usuario: UsuarioModel } = require('../models');

// Obtener todos los usuarios (solo admin)
router.get('/', verificarToken, soloAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'email', 'rol']
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los usuarios' });
  }
});

// Eliminar un usuario (solo admin)
router.delete('/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

    await usuario.destroy();
    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el usuario' });
  }
});

// Actualizar un usuario (solo admin)
router.put('/:id', verificarToken, soloAdmin, async (req, res) => {
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
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el usuario' });
  }
});

// Crear un nuevo usuario (solo admin)
router.post('/', verificarToken, soloAdmin, async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ msg: 'Ya existe un usuario con ese email' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      contraseña: hashedPassword, // Cambiado de 'password' a 'contraseña'
      rol,
    });

    // Devolvemos el usuario sin la contraseña
    const { password: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();

    res.status(201).json({ usuario: usuarioSinPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear el usuario' });
  }
});

// Obtener publicaciones de un usuario
router.get('/:id/publicaciones', async (req, res) => {
  try {
    const publicaciones = await require('../models/Publicacion').findAll({
      where: { UsuarioId: req.params.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(publicaciones);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener publicaciones del usuario' });
  }
});

// Obtener eventos a los que el usuario está apuntado (futuros)
router.get('/:id/eventos-apuntado', async (req, res) => {
  try {
    const { Evento, Usuario } = require('../models');
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });
    const eventos = await usuario.getEventosAsistidos({
      where: { fecha: { [require('sequelize').Op.gte]: new Date() } },
      order: [['fecha', 'ASC']]
    });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener eventos apuntados' });
  }
});

// Obtener eventos pasados a los que el usuario asistió
router.get('/:id/eventos-pasados', async (req, res) => {
  try {
    const { Evento, Usuario } = require('../models');
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });
    const eventos = await usuario.getEventosAsistidos({
      where: { fecha: { [require('sequelize').Op.lt]: new Date() } },
      order: [['fecha', 'DESC']]
    });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener eventos pasados' });
  }
});

// Obtener todos los usuarios públicos (sin autenticación, solo id y nombre)
router.get('/publicos', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre']
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener los usuarios' });
  }
});

// Obtener un usuario por id (público)
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: ['id', 'nombre', 'email', 'createdAt', 'rol']
    });
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener el usuario' });
  }
});

// Seguir a un usuario
router.post('/:id/seguir', verificarToken, async (req, res) => {
  try {
    const seguidoId = parseInt(req.params.id);
    const seguidorId = req.usuario.id;
    if (seguidorId === seguidoId) return res.status(400).json({ msg: 'No puedes seguirte a ti mismo' });
    // Verificar si ya sigue
    const yaSigue = await Seguidores.findOne({ where: { seguidorId, seguidoId } });
    if (yaSigue) return res.status(400).json({ msg: 'Ya sigues a este usuario' });
    await Seguidores.create({ seguidorId, seguidoId });
    res.json({ msg: 'Ahora sigues a este usuario' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al seguir usuario' });
  }
});

// Dejar de seguir a un usuario
router.post('/:id/dejar-seguir', verificarToken, async (req, res) => {
  try {
    const seguidoId = parseInt(req.params.id);
    const seguidorId = req.usuario.id;
    const fila = await Seguidores.findOne({ where: { seguidorId, seguidoId } });
    if (!fila) return res.status(400).json({ msg: 'No sigues a este usuario' });
    await fila.destroy();
    res.json({ msg: 'Has dejado de seguir a este usuario' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al dejar de seguir usuario' });
  }
});

// Obtener número de seguidores y si el usuario actual lo sigue
router.get('/:id/seguidores', async (req, res) => {
  try {
    const seguidoId = parseInt(req.params.id);
    const seguidores = await Seguidores.count({ where: { seguidoId } });
    let sigue = false;
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const seguidorId = payload.id;
        sigue = !!await Seguidores.findOne({ where: { seguidorId, seguidoId } });
      } catch {}
    }
    res.json({ seguidores, sigue });
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener seguidores' });
  }
});

// Obtener la lista de usuarios que siguen a un usuario
router.get('/:id/seguidores-lista', async (req, res) => {
  try {
    const seguidoId = parseInt(req.params.id);
    const { Usuario, Seguidores } = require('../models');
    // Buscar todos los seguidores de este usuario
    const seguidores = await Seguidores.findAll({
      where: { seguidoId },
      include: [{
        model: Usuario,
        as: 'seguidor',
        attributes: ['id', 'nombre', 'email']
      }]
    });
    // Extraer solo los datos del usuario seguidor
    const lista = seguidores.map(s => s.seguidor);
    res.json({ seguidores: lista });
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener la lista de seguidores' });
  }
});

// Obtener usuarios a los que sigue un usuario (para chat)
router.get('/:id/seguidos', async (req, res) => {
  try {
    const seguidorId = parseInt(req.params.id);
    const { Usuario, Seguidores } = require('../models');
    // Buscar todos los seguidos por este usuario
    const seguidos = await Seguidores.findAll({
      where: { seguidorId },
      include: [{
        model: Usuario,
        as: 'seguido',
        attributes: ['id', 'nombre', 'email']
      }]
    });
    // Extraer solo los datos del usuario seguido
    const lista = seguidos.map(s => s.seguido);
    res.setHeader('Content-Type', 'application/json');
    res.json(lista);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener la lista de seguidos' });
  }
});

// Obtener eventos finalizados a los que el usuario asistió (para valoraciones)
router.get('/:id/eventos-asistidos', async (req, res) => {
  try {
    const { Evento, Usuario } = require('../models');
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });
    const eventos = await usuario.getEventosAsistidos({
      where: { fecha: { [require('sequelize').Op.lt]: new Date() } },
      order: [['fecha', 'DESC']]
    });
    res.json({ eventos });
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener eventos asistidos' });
  }
});

// Obtener eventos finalizados creados por el usuario y su media de valoraciones
router.get('/:id/eventos-finalizados-creados', async (req, res) => {
  try {
    const { Evento, Valoracion } = require('../models');
    const eventos = await Evento.findAll({
      where: {
        usuarioId: req.params.id,
        fecha: { [require('sequelize').Op.lt]: new Date() },
        activo: true,
      },
      order: [['fecha', 'DESC']],
    });
    // Para cada evento, calcular la media de valoraciones
    const eventosConMedia = await Promise.all(eventos.map(async (evento) => {
      const valoraciones = await Valoracion.findAll({ where: { eventoId: evento.id } });
      let media = null;
      if (valoraciones.length > 0) {
        media = valoraciones.reduce((acc, v) => acc + v.valor, 0) / valoraciones.length;
        media = Math.round(media * 100) / 100;
      }
      return {
        id: evento.id,
        titulo: evento.titulo,
        descripcion: evento.descripcion,
        fecha: evento.fecha,
        mediaValoracion: media,
        totalValoraciones: valoraciones.length,
      };
    }));
    res.json({ eventos: eventosConMedia });
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener eventos finalizados creados' });
  }
});

module.exports = router;
