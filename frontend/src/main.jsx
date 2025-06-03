// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; 
import PublicacionDetalle from './pages/PublicacionDetalle';
import About from './pages/About';
import './assets/styles/index.css';
import './assets/styles/App.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/publicaciones/:id" element={<PublicacionDetalle />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
