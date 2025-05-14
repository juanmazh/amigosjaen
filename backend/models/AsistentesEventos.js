const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Usuario = require("./Usuario");
const Evento = require("./Evento");

const AsistentesEventos = sequelize.define("AsistentesEventos", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: "id",
    },
  },
  eventoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Evento,
      key: "id",
    },
  },
});

module.exports = AsistentesEventos;
