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
    type: DataTypes.ARRAY(DataTypes.STRING), // Almacena URLs de imágenes
    allowNull: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// Relación con Usuario
Evento.belongsTo(Usuario, { foreignKey: "usuarioId" });

module.exports = Evento;