const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const Usuario = require('./models/Usuario');
const Publicacion = require('./models/Publicacion');

const app = express();
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => res.send('API funcionando'));

// Sincronizar base de datos
sequelize.sync({ force: false }).then(() => console.log('Base de datos sincronizada'));

// Rutas de autenticación
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);  // Prefijo /api/auth para las rutas de autenticación

// Puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
