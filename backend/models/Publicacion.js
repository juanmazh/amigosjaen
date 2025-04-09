const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Publicacion = sequelize.define('Publicacion', {
  titulo: { type: DataTypes.STRING, allowNull: false },
  contenido: { type: DataTypes.TEXT, allowNull: false },
});

Usuario.hasMany(Publicacion);
Publicacion.belongsTo(Usuario);

module.exports = Publicacion;
