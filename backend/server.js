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
const notificacionesRoutes = require('./routes/notificaciones');
const realtime = require('./realtime');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const o = origin.replace(/\/$/, '').toLowerCase();
  // Locales
  if (o.startsWith('http://localhost') || o.startsWith('http://127.0.0.1')) return true;
  // Netlify (cualquier subdominio)
  if (o.endsWith('.netlify.app')) return true;
  // FRONTEND_URL explícita
  if (process.env.FRONTEND_URL) {
    const allowed = process.env.FRONTEND_URL.replace(/\/$/, '').toLowerCase();
    if (o === allowed) return true;
  }
  return false;
};

const corsOptions = {
  origin: (origin, callback) => callback(null, isOriginAllowed(origin)),
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
app.use('/api/notificaciones', notificacionesRoutes);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => callback(null, isOriginAllowed(origin)),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
});

realtime.setIo(io);
const { usuariosConectados } = realtime;

io.on('connection', (socket) => {
  socket.on('registrarUsuario', (userId) => {
    usuariosConectados.set(Number(userId), socket.id);
    socket.userId = Number(userId);
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
    // SYNC_ALTER=true en Render solo cuando quieras propagar cambios de modelo a la DB.
    // En condiciones normales, deja la variable sin definir o en "false".
    const alterar = process.env.SYNC_ALTER === 'true';
    if (alterar) console.warn('⚠️  Ejecutando sync({ alter: true }) — modificará el esquema de la DB');
    return sequelize.sync({ force: false, alter: alterar });
  })
  .then(() => {
    server.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Error al conectar con la base de datos:', err.message);
    process.exit(1);
  });
