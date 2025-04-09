import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import React from "react";

function Home() {
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Home.jsx se ha montado");
    api.get("/")
      .then((res) => {
        console.log("Respuesta de la API:", res.data);
        setMensaje(res.data);
      })
      .catch((err) => console.error("Error en la API:", err));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Bienvenido al Foro</h1>
      <p className="text-gray-700 mb-6">{mensaje || "Conéctate con la comunidad"}</p>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => navigate("/login")}
        >
          Iniciar Sesión
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          onClick={() => navigate("/register")}
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}

export default Home;
