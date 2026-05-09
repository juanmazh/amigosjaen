require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const http = require('http');
const socketIo = require('socket.io');

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

const normalize = (url) => url?.replace(/\/$/, '').toLowerCase();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
].map(normalize);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(normalize(origin))) {
      callback(null, true);
    } else {
      // Devuelve false en lugar de lanzar Error para que CORS siga enviando cabeceras
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.get('/', (req, res) => res.json({ status: 'ok', app: 'AmigosJaén API' }));

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/etiquetas', etiquetasRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/comentarios', comentariosRouter);
app.use('/api/mensajes', mensajesDirectosRoutes);
app.use('/api/valoraciones', valoracionesRoutes);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(normalize(origin))) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
});

const usuariosConectados = new Map();

io.on('connection', (socket) => {
  socket.on('registrarUsuario', (userId) => {
    usuariosConectados.set(userId, socket.id);
    socket.userId = userId;
  });

  socket.on('mensajeDirecto', async (data) => {
    const { remitenteId, destinatarioId, contenido } = data;
    const { MensajeDirecto } = require('./models');
    const mensaje = await MensajeDirecto.create({ remitenteId, destinatarioId, contenido, leido: false });
    const destinatarioSocketId = usuariosConectados.get(destinatarioId);
    if (destinatarioSocketId) {
      io.to(destinatarioSocketId).emit('nuevoMensaje', mensaje);
      io.to(destinatarioSocketId).emit('notificacion', { tipo: 'mensaje', remitenteId });
    }
    socket.emit('mensajeEnviado', mensaje);
  });

  socket.on('disconnect', () => {
    if (socket.userId) usuariosConectados.delete(socket.userId);
  });
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida');
    return sequelize.sync({ force: false });
  })
  .then(() => {
    server.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Error al conectar con la base de datos:', err.message);
    process.exit(1);
  });
