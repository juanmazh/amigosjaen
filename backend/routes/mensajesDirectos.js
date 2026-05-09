//rutas para manejar mensajes directos entre usuarios
const express = require('express');
const router = express.Router();
const mensajeDirectoController = require('../controllers/mensajeDirectoController');
const verificarToken = require('../middleware/verificarToken');

// Enviar mensaje directo
router.post('/', verificarToken, mensajeDirectoController.enviarMensaje);

// Obtener historial de mensajes entre dos usuarios
router.get('/:otroUsuarioId', verificarToken, mensajeDirectoController.obtenerHistorial);

// Marcar mensajes como leídos
router.put('/leido', verificarToken, mensajeDirectoController.marcarComoLeido);

// Obtener el resumen de conversaciones (último mensaje por chat)
router.get('/conversaciones/:usuarioId', verificarToken, mensajeDirectoController.obtenerConversaciones);

module.exports = router;
