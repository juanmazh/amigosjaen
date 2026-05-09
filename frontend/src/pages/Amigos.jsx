import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import api from "../api";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Amigos = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    api.get("/usuarios/publicos")
      .then(res => { setUsuarios(res.data.usuario || res.data); setCargando(false); })
      .catch(() => setCargando(false));
  }, []);

  const filtrados = usuarios.filter(u => u.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="min-h-screen flex flex-col bg-crema-100">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        <div className="mb-8">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-jaen-500 font-semibold mb-2">
            La comunidad
          </span>
          <h1 className="font-display text-5xl text-jaen-700 font-semibold">Amigos</h1>
          <p className="text-piedra-500 mt-2">Descubre a otros vecinos y conecta con ellos.</p>
        </div>

        <div className="relative mb-8">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-piedra-500/60" />
          <input
            type="text"
            placeholder="Buscar por nombre…"
            className="w-full pl-11 pr-4 py-3 rounded-full border border-crema-300 bg-white focus:border-jaen-400 focus:ring-2 focus:ring-jaen-200 outline-none transition-all"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        {cargando ? (
          <p className="text-piedra-500 text-center">Cargando…</p>
        ) : filtrados.length === 0 ? (
          <div className="bg-white border border-crema-300 rounded-2xl p-12 text-center">
            <p className="text-piedra-500">No se encontraron usuarios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtrados.map(u => (
              <Link
                to={`/perfil/${u.id}`}
                key={u.id}
                className="group bg-white border border-crema-300 rounded-2xl p-5 flex items-center gap-4 hover:border-jaen-300 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-jaen-100 text-jaen-600 flex items-center justify-center font-display text-xl font-semibold shrink-0">
                  {u.nombre?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-piedra-900 group-hover:text-jaen-600 transition-colors truncate">{u.nombre}</p>
                  <p className="text-xs text-piedra-500">Ver perfil →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Amigos;
