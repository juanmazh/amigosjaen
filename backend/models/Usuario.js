//modelo para la tabla usuarios
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
//Datos que son relevantes al usuario
const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.STRING,
    defaultValue: 'usuario'  // Rol por defecto es 'usuario'
  }
});

module.exports = Usuario;
