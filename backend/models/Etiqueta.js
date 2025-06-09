//modelo para la tabla etiqueta
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Publicacion = require('./Publicacion');

const Etiqueta = sequelize.define('Etiqueta', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

// Relaciones definidas en models/index.js

module.exports = Etiqueta;