import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PerfilSecciones from "./components/PerfilSecciones";
import api from "../api";

const Perfil = () => {
  const { usuario } = useContext(AuthContext);
  const [seguidores, setSeguidores] = useState(0);
  const [cargandoSeg, setCargandoSeg] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [listaSeguidores, setListaSeguidores] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    setCargandoSeg(true);
    api.get(`/usuarios/${usuario.id}/seguidores`)
      .then((res) => setSeguidores(res.data.seguidores))
      .finally(() => setCargandoSeg(false));
  }, [usuario]);

  const abrirModal = () => {
    setModalAbierto(true);
    setCargandoLista(true);
    api.get(`/usuarios/${usuario.id}/seguidores-lista`)
      .then((res) => setListaSeguidores(res.data.seguidores || []))
      .finally(() => setCargandoLista(false));
  };

  if (!usuario) {
    return (
      <div className="min-h-screen flex flex-col bg-crema-100">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-piedra-500">Inicia sesión para ver tu perfil.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const fechaAlta = usuario.createdAt
    ? new Date(usuario.createdAt).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
    : "";

  const inicial = usuario.nombre?.[0]?.toUpperCase() || "U";

  return (
    <div className="min-h-screen flex flex-col bg-crema-100">
      <Header />
      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-jaen-700 to-jaen-500 text-white">
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-white/15 backdrop-blur border-4 border-white/30 flex items-center justify-center mb-4">
              <span className="font-display text-4xl font-semibold">{inicial}</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-2">{usuario.nombre}</h1>
            <p className="text-crema-100/80 text-sm mb-4">{usuario.email}</p>
            <div className="flex items-center justify-center gap-6 text-sm">
              {fechaAlta && (
                <div>
                  <p className="text-crema-100/70 text-xs uppercase tracking-wider">Miembro desde</p>
                  <p className="font-medium">{fechaAlta}</p>
                </div>
              )}
              <div className="w-px h-8 bg-white/20" />
              <button onClick={abrirModal} className="text-left hover:opacity-80 transition-opacity">
                <p className="text-crema-100/70 text-xs uppercase tracking-wider">Seguidores</p>
                <p className="font-medium">{cargandoSeg ? "…" : seguidores}</p>
              </button>
            </div>
          </div>
        </section>

        <PerfilSecciones usuario={usuario} editable={true} mostrarEventosPorEstado={true} />
      </main>
      <Footer />

      {modalAbierto && (
        <div className="fixed inset-0 bg-piedra-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModalAbierto(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-crema-300">
              <h3 className="font-display text-xl text-jaen-700 font-semibold">Seguidores</h3>
              <button onClick={() => setModalAbierto(false)} className="text-piedra-500 hover:text-piedra-900 text-xl">×</button>
            </div>
            <div className="p-6 max-h-80 overflow-y-auto">
              {cargandoLista ? (
                <p className="text-piedra-500">Cargando…</p>
              ) : listaSeguidores.length === 0 ? (
                <p className="text-piedra-500">No tienes seguidores aún.</p>
              ) : (
                <ul className="divide-y divide-crema-200">
                  {listaSeguidores.map((u) => (
                    <li key={u.id} className="py-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-jaen-100 text-jaen-600 flex items-center justify-center font-semibold">
                        {u.nombre?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-piedra-900">{u.nombre}</p>
                        <p className="text-xs text-piedra-500">{u.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;
