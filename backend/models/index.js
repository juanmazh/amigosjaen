const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Publicacion = require('./Publicacion');
const Etiqueta = require('./Etiqueta');

// Definir relaciones
Usuario.hasMany(Publicacion);
Publicacion.belongsTo(Usuario);
Publicacion.belongsToMany(Etiqueta, { through: 'PublicacionEtiquetas' });
Etiqueta.belongsToMany(Publicacion, { through: 'PublicacionEtiquetas' });

module.exports = {
  sequelize,
  Usuario,
  Publicacion,
  Etiqueta,
};