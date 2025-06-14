const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
require('dotenv').config(); 
const JWT_SECRET = process.env.JWT_SECRET; // clave secreta para firmar los tokens

// Función REGISTER
exports.register = async (req, res) => {
  const { nombre, email, contraseña, rol } = req.body;

  // Validación básica de los campos
  if (!nombre || !email || !contraseña) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si ya existe el usuario
    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseñaHasheada = await bcrypt.hash(contraseña, salt);

    // Crear el nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      contraseña: contraseñaHasheada,
      rol: rol || 'usuario',  // es 'usuario' siempre
    });

    // Crear el token JWT
    const payload = { id: nuevoUsuario.id , rol: nuevoUsuario.rol};
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // Enviar la respuesta con el token y el usuario
    res.json({
      token,
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
        createdAt: nuevoUsuario.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al registrar usuario', error });
  }
};

// Función LOGIN
exports.login = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ msg: 'El usuario no existe' });
    }

    // Verificar la contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    // Crear token
    const payload = {
      id: usuario.id,
      rol: usuario.rol,  
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // Responder con token y los datos del usuario
    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        createdAt: usuario.createdAt,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al iniciar sesión');
  }
};

// Función para obtener el usuario autenticado
exports.obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuarioId, {
      attributes: ['id', 'nombre', 'email', 'rol', 'createdAt'] 
    });

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener usuario" });
  }
};

// Función para crear una publicación
exports.crearPublicacion = async (req, res) => {
  try {
    const { titulo, contenido, etiquetas } = req.body;
    const nuevaPublicacion = await Publicacion.create({
      titulo,
      contenido,
      etiquetas: etiquetas.join(','), // Convertir el array de etiquetas a una cadena separada por comas
      UsuarioId: req.usuario.id,
    });
    res.status(201).json(nuevaPublicacion);
  } catch (error) {
    console.error('Error al crear publicación:', error);
    res.status(500).json({ error: 'Error al crear la publicación' });
  }
};