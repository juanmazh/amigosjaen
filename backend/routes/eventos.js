const express = require("express");
const router = express.Router();
const { crearEvento, listarEventos, listarEventoPorId, eliminarEvento, inscribirAsistente, obtenerAsistentes, eliminarAsistente, updateEvento } = require("../controllers/eventoController");
const verificarToken = require("../middleware/verificarToken");

// Crear un evento
router.post("/", verificarToken, crearEvento);

// Listar eventos
router.get("/", listarEventos);

// Obtener detalles de un evento específico
router.get("/:id", listarEventoPorId);

// Eliminar un evento (requiere autenticación)
router.delete("/:id", verificarToken, eliminarEvento);

// Inscribir usuario logeado a un evento
router.post("/:id/asistir", verificarToken, inscribirAsistente);

// Obtener asistentes de un evento
router.get("/:id/asistentes", obtenerAsistentes);

// Eliminar asistente de un evento (solo el creador puede)
router.delete('/:id/asistentes/:usuarioId', verificarToken, eliminarAsistente);

// Actualizar un evento (dueño o admin)
router.put('/:id', verificarToken, updateEvento);

module.exports = router;