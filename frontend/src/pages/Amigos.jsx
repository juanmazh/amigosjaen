import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Header from "./components/Header";
import Footer from "./components/Footer";
// pagina de /amigos
const Amigos = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    api.get("/usuarios/publicos").then(res => {
      setUsuarios(res.data.usuario ? res.data.usuario : res.data);
      setCargando(false);
    }).catch(() => setCargando(false));
  }, []);

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 to-purple-200">
      <Header />
      <main className="flex-1 w-full max-w-none px-2 sm:px-6 md:px-12 lg:px-32 xl:px-48 2xl:px-64 mx-auto py-8">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-8 text-center drop-shadow-lg tracking-tight">Amigos</h2>
        <div className="mb-6 w-full">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ boxShadow: '0 1px 4px 0 rgba(80, 0, 120, 0.07)' }}
          />
        </div>
        {cargando ? (
          <p className="text-center">Cargando usuarios...</p>
        ) : usuariosFiltrados.length === 0 ? (
          <p className="text-center text-gray-500">No se encontraron usuarios.</p>
        ) : (
          <ul className="divide-y divide-gray-200 bg-white rounded-2xl shadow-lg p-6">
            {usuariosFiltrados.map(u => (
              <li key={u.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <span className="font-semibold text-lg text-gray-800">{u.nombre}</span>
                <Link
                  to={`/perfil/${u.id}`}
                  className="text-blue-600 hover:underline text-base bg-blue-100 px-4 py-2 rounded shadow-sm hover:bg-blue-200 transition"
                >
                  Ver perfil
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Amigos;
