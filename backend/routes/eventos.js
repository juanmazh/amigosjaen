const express = require("express");
const router = express.Router();
const { crearEvento, listarEventos, listarEventoPorId } = require("../controllers/eventoController");
const verificarToken = require("../middleware/verificarToken");

// Crear un evento
router.post("/", verificarToken, crearEvento);

// Listar eventos
router.get("/", listarEventos);

// Obtener detalles de un evento específico
router.get("/:id", listarEventoPorId);

module.exports = router;