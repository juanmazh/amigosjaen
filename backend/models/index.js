const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Publicacion = require('./Publicacion');
const Etiqueta = require('./Etiqueta');
const Evento = require('./Evento');
const AsistentesEventos = require('./AsistentesEventos');

// Definir relaciones
Usuario.hasMany(Publicacion);
Publicacion.belongsTo(Usuario);
Publicacion.belongsToMany(Etiqueta, { through: 'PublicacionEtiquetas' });
Etiqueta.belongsToMany(Publicacion, { through: 'PublicacionEtiquetas' });

// Relación muchos a muchos para asistentes de eventos
Evento.belongsToMany(Usuario, { through: AsistentesEventos, as: 'eventoAsistentes', foreignKey: 'eventoId' });
Usuario.belongsToMany(Evento, { through: AsistentesEventos, as: 'eventosAsistidos', foreignKey: 'usuarioId' });
AsistentesEventos.belongsTo(Usuario, { foreignKey: 'usuarioId' });
AsistentesEventos.belongsTo(Evento, { foreignKey: 'eventoId' });

module.exports = {
  sequelize,
  Usuario,
  Publicacion,
  Etiqueta,
  Evento,
  AsistentesEventos,
};