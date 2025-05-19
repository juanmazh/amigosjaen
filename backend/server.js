require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, Usuario, Publicacion, Etiqueta } = require('./models');

// Rutas
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const publicacionesRoutes = require('./routes/publicaciones');
const etiquetasRoutes = require('./routes/etiquetas');
const eventosRoutes = require('./routes/eventos');

const app = express();
app.use(express.json());
// Mover la configuración de CORS ANTES de las rutas y de cualquier otro middleware
app.use(cors({
  origin: [
    'http://localhost:5173', // Frontend en desarrollo
    'https://amigosjaen.netlify.app', // Frontend en producción
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Permitir envío de cookies o credenciales
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

// Sincronizar base de datos
sequelize.sync({ force: false }).then(async () => {
  console.log('Base de datos sincronizada');
  
  // Inspeccionar métodos del modelo Publicacion
  const publicacion = await Publicacion.build();
  console.log('Métodos disponibles en Publicacion:', Object.keys(publicacion.__proto__));

  // Continuar con el servidor
  app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
});

// Puerto
const PORT = process.env.PORT || 5000;
