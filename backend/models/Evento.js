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
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  localizacion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Evento;
