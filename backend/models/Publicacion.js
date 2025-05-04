const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Publicacion = sequelize.define('Publicacion', {
  titulo: { type: DataTypes.STRING, allowNull: false },
  contenido: { type: DataTypes.TEXT, allowNull: false },
  etiquetas: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('etiquetas');
      return rawValue ? rawValue.split(',') : [];
    },
    set(value) {
      this.setDataValue('etiquetas', Array.isArray(value) ? value.join(',') : value);
    }
  },
});

Usuario.hasMany(Publicacion);
Publicacion.belongsTo(Usuario);

module.exports = Publicacion;
