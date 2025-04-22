const express = require('express');
const router = express.Router();
const Publicacion = require('../models/Publicacion');
const Usuario = require('../models/Usuario');

router.get('/', async (req, res) => {
  try {
    const publicaciones = await Publicacion.findAll({
      include: {
        model: Usuario,
        attributes: ['nombre'],
      },
      order: [['createdAt', 'DESC']]
    });

    const formateadas = publicaciones.map(pub => ({
      id: pub.id,
      titulo: pub.titulo,
      contenido: pub.contenido,
      autorNombre: pub.Usuario.nombre,
    }));

    res.json(formateadas);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener publicaciones' });
  }
});

module.exports = router;
