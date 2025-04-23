require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Modelos
const Usuario = require('./models/Usuario');
const Publicacion = require('./models/Publicacion');

// Rutas
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const publicacionesRoutes = require('./routes/publicaciones');

const app = express();
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => res.send('API funcionando'));

// Rutas protegidas
app.use('/api/usuarios', usuariosRoutes); // En este archivo puedes proteger con middlewares las rutas que necesites

// Rutas públicas
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/auth', authRoutes); // Autenticación (login, registro, etc.)

// Sincronizar base de datos
sequelize.sync({ force: false }).then(() => console.log('Base de datos sincronizada'));

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
