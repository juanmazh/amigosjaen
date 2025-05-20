const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Publicacion = sequelize.define('Publicacion', {
  titulo: { type: DataTypes.STRING, allowNull: false },
  contenido: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'Publicaciones', // Forzar el nombre de la tabla
});

Usuario.hasMany(Publicacion);
Publicacion.belongsTo(Usuario);
// Las relaciones belongsToMany se definen solo en models/index.js

module.exports = Publicacion;
