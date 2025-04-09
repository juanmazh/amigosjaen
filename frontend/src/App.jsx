import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from './pages/Login';
import Register from "./pages/Register";
import PanelUsuarios from "./pages/PanelUsuarios";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<PanelUsuarios />} />



    </Routes>
  );
}

export default App;
