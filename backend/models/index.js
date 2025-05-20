const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Publicacion = require('./Publicacion');
const Etiqueta = require('./Etiqueta');
const Evento = require('./Evento');
const AsistentesEventos = require('./AsistentesEventos');
const Comentario = require('./Comentario');

// Definir relaciones
Usuario.hasMany(Publicacion);
Publicacion.belongsTo(Usuario);
Publicacion.belongsToMany(Etiqueta, { through: 'PublicacionEtiquetas', as: 'tags', foreignKey: 'PublicacionId', otherKey: 'EtiquetaId' });
Etiqueta.belongsToMany(Publicacion, { through: 'PublicacionEtiquetas', as: 'publicaciones', foreignKey: 'EtiquetaId', otherKey: 'PublicacionId' });
Evento.belongsToMany(Etiqueta, { through: 'EventoEtiquetas', as: 'eventosTags', foreignKey: 'EventoId', otherKey: 'EtiquetaId' });
Etiqueta.belongsToMany(Evento, { through: 'EventoEtiquetas', as: 'etiquetasDeEvento', foreignKey: 'EtiquetaId', otherKey: 'EventoId' });

// Relación muchos a muchos para asistentes de eventos
Evento.belongsToMany(Usuario, { through: AsistentesEventos, as: 'eventoAsistentes', foreignKey: 'eventoId' });
Usuario.belongsToMany(Evento, { through: AsistentesEventos, as: 'eventosAsistidos', foreignKey: 'usuarioId' });
AsistentesEventos.belongsTo(Usuario, { foreignKey: 'usuarioId' });
AsistentesEventos.belongsTo(Evento, { foreignKey: 'eventoId' });

// Relación comentarios
Publicacion.hasMany(Comentario, { foreignKey: 'publicacionId', as: 'comentarios' });
Comentario.belongsTo(Publicacion, { foreignKey: 'publicacionId' });
Usuario.hasMany(Comentario, { foreignKey: 'usuarioId', as: 'comentarios' });
Comentario.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Comentario.hasMany(Comentario, { foreignKey: 'parentId', as: 'respuestas' });
Comentario.belongsTo(Comentario, { foreignKey: 'parentId', as: 'padre' });

module.exports = {
  sequelize,
  Usuario,
  Publicacion,
  Etiqueta,
  Evento,
  AsistentesEventos,
  Comentario,
};