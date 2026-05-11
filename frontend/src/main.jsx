// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import PublicacionDetalle from './pages/PublicacionDetalle';
import About from './pages/About';
import './assets/styles/index.css';
import './assets/styles/App.css';
//Gestión de rutas y contexto de autenticación
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/publicaciones/:id" element={<PublicacionDetalle />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<App />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
