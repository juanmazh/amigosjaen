//Ruta para manejar publicaciones y etiquetas
const express = require('express');
const router = express.Router();
const { Publicacion, Usuario, Etiqueta } = require('../models');
const verificarToken = require("../middleware/verificarToken");
const sequelize = require('sequelize');

router.get('/', async (req, res) => {
  try {
    const publicaciones = await Publicacion.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['nombre'],
        },
        {
          model: Etiqueta,
          as: 'tags',
          attributes: ['id', 'nombre'],
          through: { attributes: [] }, // No incluir datos de la tabla intermedia
        },
      ],
      order: [['createdAt', 'DESC']]
    });

    const formateadas = publicaciones.map(pub => ({
      id: pub.id,
      titulo: pub.titulo,
      contenido: pub.contenido,
      autorNombre: pub.Usuario.nombre,
      tags: pub.tags ? pub.tags.map(tag => ({ id: tag.id, nombre: tag.nombre })) : [],
    }));

    res.json(formateadas);
  } catch (err) {
    console.error('Error al obtener publicaciones:', err);
    res.status(500).json({ msg: 'Error al obtener publicaciones' });
  }
});

// Ruta para obtener una publicación por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const publicacion = await Publicacion.findOne({
      where: { id },
      include: [
        {
          model: Usuario,
          attributes: ['nombre'],
        },
        {
          model: Etiqueta,
          as: 'tags',
          attributes: ['nombre'],
        },
      ],
    });

    if (!publicacion) {
      return res.status(404).json({ msg: 'Publicación no encontrada' });
    }

    console.log('Respuesta del backend:', publicacion);

    const detalle = {
      id: publicacion.id,
      titulo: publicacion.titulo,
      contenido: publicacion.contenido,
      autorNombre: publicacion.Usuario.nombre,
      tags: publicacion.tags.map(tag => ({ id: tag.id, nombre: tag.nombre })), // Devolver etiquetas con id y nombre
    };

    res.json(detalle);
  } catch (err) {
    console.error('Error al obtener la publicación:', err);
    res.status(500).json({ msg: 'Error al obtener la publicación' });
  }
});

// Modificar la ruta de creación de publicaciones para manejar etiquetas
router.post('/', async (req, res) => {
  try {
    console.log('Datos recibidos en el backend:', req.body); // Log para depurar los datos recibidos
    const { titulo, contenido, usuarioId, etiquetas } = req.body;

    if (!titulo || !contenido || !usuarioId) {
      return res.status(400).json({ msg: 'Faltan campos requeridos' });
    }

    // Crear la publicación
    const publicacion = await Publicacion.create({
      titulo,
      contenido,
      UsuarioId: usuarioId,
    });

    // Manejar etiquetas
    if (etiquetas && etiquetas.length > 0) {
      const etiquetasNormalizadas = etiquetas.map(nombre => nombre.trim().toLowerCase());
      console.log('Etiquetas normalizadas:', etiquetasNormalizadas);
      const etiquetasCreadas = await Promise.all(
        etiquetasNormalizadas.map(async (nombre) => {
          // Buscar ignorando mayúsculas/minúsculas
          let etiqueta = await Etiqueta.findOne({ where: sequelize.where(sequelize.fn('LOWER', sequelize.col('nombre')), nombre) });
          if (!etiqueta) {
            etiqueta = await Etiqueta.create({ nombre });
            console.log('Etiqueta creada:', etiqueta.id, etiqueta.nombre);
          } else {
            console.log('Etiqueta encontrada:', etiqueta.id, etiqueta.nombre);
          }
          return etiqueta;
        })
      );
      await publicacion.addTags(etiquetasCreadas);
    }

    res.status(201).json(publicacion);
  } catch (err) {
    console.error('Error al crear publicación:', err);
    res.status(500).json({ msg: 'Error al crear publicación' });
  }
});

// Ruta para asociar etiquetas a una publicación
router.post('/:id/etiquetas', async (req, res) => {
  try {
    const { id } = req.params;
    const { etiquetas } = req.body; // Array de nombres de etiquetas

    const publicacion = await Publicacion.findByPk(id);
    if (!publicacion) {
      return res.status(404).json({ msg: 'Publicación no encontrada' });
    }

    const etiquetasCreadas = await Promise.all(
      etiquetas.map(async (nombre) => {
        const [etiqueta] = await Etiqueta.findOrCreate({ where: { nombre } });
        return etiqueta;
      })
    );

    await publicacion.addTags(etiquetasCreadas);
    res.status(200).json({ msg: 'Etiquetas asociadas correctamente' });
  } catch (err) {
    console.error('Error al asociar etiquetas:', err);
    res.status(500).json({ msg: 'Error al asociar etiquetas' });
  }
});

// Ruta para obtener todas las etiquetas
router.get('/etiquetas', async (req, res) => {
  try {
    const etiquetas = await Etiqueta.findAll();
    res.json(etiquetas);
  } catch (err) {
    console.error('Error al obtener etiquetas:', err);
    res.status(500).json({ msg: 'Error al obtener etiquetas' });
  }
});

// Eliminar una publicación (dueño o admin)
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const publicacion = await Publicacion.findByPk(id);
    if (!publicacion) {
      return res.status(404).json({ msg: 'Publicación no encontrada' });
    }
    // Permitir si es el dueño o admin
    if (publicacion.UsuarioId !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ msg: 'No tienes permiso para borrar esta publicación' });
    }
    await publicacion.destroy();
    res.status(200).json({ msg: 'Publicación eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar publicación:', err);
    res.status(500).json({ msg: 'Error al eliminar publicación' });
  }
});

// Actualizar una publicación (dueño o admin)
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido } = req.body;
    const publicacion = await Publicacion.findByPk(id);
    if (!publicacion) {
      return res.status(404).json({ msg: 'Publicación no encontrada' });
    }
    // Permitir si es el dueño o admin
    if (publicacion.UsuarioId !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ msg: 'No tienes permiso para editar esta publicación' });
    }
    publicacion.titulo = titulo;
    publicacion.contenido = contenido;
    await publicacion.save();
    res.json({ id: publicacion.id, titulo: publicacion.titulo, contenido: publicacion.contenido });
  } catch (err) {
    console.error('Error al actualizar publicación:', err);
    res.status(500).json({ msg: 'Error al actualizar publicación' });
  }
});

module.exports = router;
