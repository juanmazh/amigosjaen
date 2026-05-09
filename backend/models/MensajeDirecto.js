//modelo para la tabla mensajes directos
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MensajeDirecto = sequelize.define('MensajeDirecto', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    remitenteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
    },
    destinatarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    leido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    timestamps: true, // createdAt = fecha de envío
    updatedAt: false, // No necesitamos updatedAt para mensajes
    tableName: 'MensajesDirectos',
  });

  // Relaciones
  MensajeDirecto.associate = (models) => {
    MensajeDirecto.belongsTo(models.Usuario, { as: 'remitente', foreignKey: 'remitenteId' });
    MensajeDirecto.belongsTo(models.Usuario, { as: 'destinatario', foreignKey: 'destinatarioId' });
  };

  return MensajeDirecto;
};
