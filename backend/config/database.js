const { Sequelize } = require("sequelize");
require("dotenv").config();
//Es algo parecido a un PDO, aquí hago la conexión a la base de datos
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false,
});


module.exports = sequelize;
