const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comentario = sequelize.define('Comentario', {
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Para comentarios anidados
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Comentarios',
      key: 'id',
    },
  },
}, {
  tableName: 'Comentarios',
});

module.exports = Comentario;
