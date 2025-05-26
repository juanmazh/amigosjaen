const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Seguidores = sequelize.define('Seguidores', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  seguidorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'id',
    },
  },
  seguidoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'id',
    },
  },
}, {
  tableName: 'Seguidores',
});

module.exports = Seguidores;
