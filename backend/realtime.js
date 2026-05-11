// Módulo compartido para acceder a io y al registro de usuarios conectados
// desde cualquier ruta (sin acoplar todas las rutas a server.js).
const usuariosConectados = new Map();
let io = null;

const setIo = (instancia) => { io = instancia; };
const getIo = () => io;

// Emitir evento a un usuario concreto (si está conectado)
const emitirAUsuario = (usuarioId, evento, payload) => {
  if (!io) return false;
  const sid = usuariosConectados.get(Number(usuarioId)) || usuariosConectados.get(usuarioId);
  if (!sid) return false;
  io.to(sid).emit(evento, payload);
  return true;
};

module.exports = { usuariosConectados, setIo, getIo, emitirAUsuario };
