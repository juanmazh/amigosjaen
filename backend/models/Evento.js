const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Evento = sequelize.define("Evento", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  asistentes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  imagenes: {
    type: DataTypes.TEXT, // Cambiado de JSON a TEXT para compatibilidad
    allowNull: true,
  },
  activo: {
    type: DataTypes.TINYINT, // Cambiado de BOOLEAN a TINYINT
    defaultValue: 1, // Cambiado de true a 1
  },
  localizacion: {
    type: DataTypes.STRING, // Puede ser dirección o coordenadas
    allowNull: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Elimino las relaciones directas para evitar referencias circulares, ahora están en models/index.js

module.exports = Evento;