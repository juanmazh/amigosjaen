'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Eliminar la clave foránea que apunta a la tabla `publicacions`
    // await queryInterface.removeConstraint('PublicacionEtiquetas', 'PublicacionEtiquetas_ibfk_1');
  },

  async down (queryInterface, Sequelize) {
    // Restaurar la clave foránea que apunta a la tabla `publicacions`
    await queryInterface.addConstraint('PublicacionEtiquetas', {
      fields: ['PublicacionId'],
      type: 'foreign key',
      name: 'PublicacionEtiquetas_ibfk_1',
      references: {
        table: 'publicacions',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
};
