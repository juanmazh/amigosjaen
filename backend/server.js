//El core del servidor de la API de Amigos Jaén
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, Usuario, Publicacion, Etiqueta } = require('./models');
const http = require('http');
const socketIo = require('socket.io');

// Rutas
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const publicacionesRoutes = require('./routes/publicaciones');
const etiquetasRoutes = require('./routes/etiquetas');
const eventosRoutes = require('./routes/eventos');
const comentariosRouter = require('./routes/comentarios'); 
const mensajesDirectosRoutes = require('./routes/mensajesDirectos');
const valoracionesRoutes = require('./routes/valoraciones');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Configuración de CORS mejorada
const allowedOrigins = [
  'http://localhost:5173', // Frontend local
  'https://amigosjaen.netlify.app', // Frontend producción
  'https://amigosjaen.onrender.com', // Backend producción
];
app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman) o si está en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
}));

// Ruta de prueba
app.get('/', (req, res) => res.send('API funcionando'));

// Rutas protegidas
app.use('/api/usuarios', usuariosRoutes); // En este archivo puedes proteger con middlewares las rutas que necesites

// Rutas públicas
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/auth', authRoutes); // Autenticación (login, registro, etc.)
app.use('/api/etiquetas', etiquetasRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/comentarios', comentariosRouter); // Nueva ruta para comentarios
app.use('/api/mensajes', mensajesDirectosRoutes); // Ruta para mensajes directos
app.use('/api/valoraciones', valoracionesRoutes); // Ruta para valoraciones de eventos

// Crear servidor HTTP y configurar socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://amigosjaen.netlify.app',
      'https://amigosjaen.onrender.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
  }
});

// Mapa para asociar usuarioId con socketId
const usuariosConectados = new Map();

// Evento de conexión de socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // El cliente debe emitir 'registrarUsuario' con su userId tras autenticarse
  socket.on('registrarUsuario', (userId) => {
    usuariosConectados.set(userId, socket.id);
    socket.userId = userId;
    console.log(`Usuario ${userId} registrado en socket ${socket.id}`);
  });

  // Evento para enviar mensaje directo en tiempo real
  socket.on('mensajeDirecto', async (data) => {
    // data: { remitenteId, destinatarioId, contenido }
    const { remitenteId, destinatarioId, contenido } = data;
    // Guardar mensaje en la base de datos
    const { MensajeDirecto } = require('./models');
    const mensaje = await MensajeDirecto.create({
      remitenteId,
      destinatarioId,
      contenido,
      leido: false,
    });
    // Emitir al destinatario si está conectado
    const destinatarioSocketId = usuariosConectados.get(destinatarioId);
    if (destinatarioSocketId) {
      io.to(destinatarioSocketId).emit('nuevoMensaje', mensaje);
      //  Emitir notificación
      io.to(destinatarioSocketId).emit('notificacion', {
        tipo: 'mensaje',
        mensaje: `Nuevo mensaje de usuario ${remitenteId}`
      });
    }
    //  Confirmar al remitente
    socket.emit('mensajeEnviado', mensaje);
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      usuariosConectados.delete(socket.userId);
    }
    console.log('Usuario desconectado:', socket.id);
  });
});

// Sincronizar base de datos
sequelize.sync({ force: false }).then(async () => {
  console.log('Base de datos sincronizada');
  
  // Inspeccionar métodos del modelo Publicacion
  const publicacion = await Publicacion.build();

  // Continuar con el servidor
  server.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
});
