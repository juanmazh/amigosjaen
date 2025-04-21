require('dotenv').config(); // Asegúrate de tener esto

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No hay token o formato incorrecto" });
  }

  const token = authHeader.split(" ")[1]; // 🧠 Aquí quitamos el "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token inválido" });
  }
};
require('dotenv').config(); // Asegúrate de tener esto

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No hay token o formato incorrecto" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token inválido" });
  }
};
