const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Usuario = require("./Usuario");

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
});

// Relación con Usuario
Evento.belongsTo(Usuario, { foreignKey: "usuarioId" });

module.exports = Evento;