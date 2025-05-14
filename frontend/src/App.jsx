// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CrearPublicacionPage from "./pages/CrearPublicacionPage";
import Foro from "./pages/Foro";
import Header from "./pages/components/Header";
import Eventos from "./pages/Eventos";
import CrearEventoPage from "./pages/CrearEventoPage";
import EventoDetalle from "./pages/EventoDetalle";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/crear-publicacion" element={<CrearPublicacionPage />} />
      <Route path="/foro" element={<Foro />} />
      <Route path="/eventos" element={<Eventos />} />
      <Route path="/crear-evento" element={<CrearEventoPage />} />
      <Route path="/eventos/:id" element={<EventoDetalle />} />
    </Routes>
  );
}

export default App;
