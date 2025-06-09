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
import Perfil from "./pages/Perfil";
import Amigos from "./pages/Amigos";
import PerfilUsuario from "./pages/PerfilUsuario";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ChatWidget from "./pages/components/ChatWidget";
import Valoraciones from "./pages/Valoraciones";
import './assets/styles/index.css';
import './assets/styles/App.css';
// Importar estilos globales y específicos de la aplicación
// Core del frontend
function App() {
  return (
    <>
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
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/amigos" element={<Amigos />} />
        <Route path="/perfil/:id" element={<PerfilUsuario />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/valoraciones" element={<Valoraciones />} />
      </Routes>
      <ChatWidget />
    </>
  );
}

export default App;
