"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Eventos", "usuarioId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // Puedes cambiar el valor por el id de admin o el que corresponda
      references: {
        model: "Usuarios",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Eventos", "usuarioId");
  },
};
