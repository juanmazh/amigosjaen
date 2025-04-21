import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Login from './pages/Login';
import Register from "./pages/Register";
import PanelUsuarios from "./pages/PanelUsuarios";
import AuthContext from "./context/AuthContext";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider> 
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<PanelUsuarios />} />
    </Routes>
    </AuthProvider>
  );
}

export default App;
