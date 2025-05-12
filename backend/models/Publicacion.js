const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Etiqueta = require('./Etiqueta');

const Publicacion = sequelize.define('Publicacion', {
  titulo: { type: DataTypes.STRING, allowNull: false },
  contenido: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'Publicaciones', // Forzar el nombre de la tabla
});

Usuario.hasMany(Publicacion);
Publicacion.belongsTo(Usuario);

Publicacion.belongsToMany(Etiqueta, { through: 'PublicacionEtiquetas', as: 'tags' });
Etiqueta.belongsToMany(Publicacion, { through: 'PublicacionEtiquetas', as: 'publicaciones' });

module.exports = Publicacion;
