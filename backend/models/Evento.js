//modelo para la tabla eventos
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
    type: DataTypes.TEXT, // Cambiado de JSON a TEXT para compatibilidad, porque Sequelize no maneja JSON directamente
    allowNull: true,
  },
  activo: {
    type: DataTypes.TINYINT, // Cambiado de BOOLEAN a TINYINT
    defaultValue: 1, // Cambiado de true a 1
  },
  localizacion: {
    type: DataTypes.STRING, // Puede ser dirección o coordenadas, Se maneja en su función
    allowNull: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
module.exports = Evento;