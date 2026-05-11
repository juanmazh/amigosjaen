// Modelo para notificaciones de usuario
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notificacion = sequelize.define('Notificacion', {
  // Usuario destinatario
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Tipo (comentario, seguidor, mensaje, evento…). Hoy: "comentario".
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Mensaje legible
  mensaje: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  // URL relativa a la que navegar al hacer click
  enlaceUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  leida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Notificacion;
