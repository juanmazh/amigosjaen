//ruta exclusive para administradores
function soloAdmin(req, res, next) {
    if (req.usuario && req.usuario.rol === 'admin') {
      next();
    } else {
      return res.status(403).json({ mensaje: 'Acceso denegado. Solo admins pueden acceder a esta ruta.' });
    }
  }
  
  module.exports = soloAdmin;
  