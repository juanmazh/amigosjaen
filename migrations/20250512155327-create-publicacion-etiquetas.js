'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('PublicacionEtiquetas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      PublicacionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Publicacions', // Nombre de la tabla de publicaciones
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      EtiquetaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Etiquetas', // Nombre de la tabla de etiquetas
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('PublicacionEtiquetas');
  }
};
