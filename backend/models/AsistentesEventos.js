//modelo para la tabla AsistentesEventos
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AsistentesEventos = sequelize.define("AsistentesEventos", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Usuarios",
      key: "id",
    },
  },
  eventoId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Eventos",
      key: "id",
    },
  },
});

module.exports = AsistentesEventos;
