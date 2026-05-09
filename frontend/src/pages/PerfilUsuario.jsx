import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PerfilSecciones from "./components/PerfilSecciones";
import { useAuth } from "../context/AuthContext";

const PerfilUsuario = () => {
  const { id } = useParams();
  const { usuario: usuarioLog, cargando: cargandoAuth } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [seguidores, setSeguidores] = useState(0);
  const [sigue, setSigue] = useState(false);
  const [cargandoSeg, setCargandoSeg] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [listaSeguidores, setListaSeguidores] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(false);
  const [cargandoBoton, setCargandoBoton] = useState(false);
  const [errorBoton, setErrorBoton] = useState("");
  const [eventosFinalizados, setEventosFinalizados] = useState([]);
  const [cargandoEventosFinalizados, setCargandoEventosFinalizados] = useState(true);

  useEffect(() => {
    api.get(`/usuarios/${id}`)
      .then(res => { setUsuario(res.data); setCargando(false); })
      .catch(() => setCargando(false));
  }, [id]);

  const cargarSeguidores = () => {
    setCargandoSeg(true);
    api.get(`/usuarios/${id}/seguidores`)
      .then(res => {
        setSeguidores(res.data.seguidores);
        setSigue(usuarioLog && usuarioLog.id !== Number(id) ? res.data.sigue : false);
      })
      .finally(() => setCargandoSeg(false));
  };

  useEffect(() => {
    if (!id || cargandoAuth) return;
    cargarSeguidores();
  }, [id, usuarioLog, cargandoAuth]);

  const handleSeguir = async () => {
    setCargandoBoton(true); setErrorBoton("");
    try { await api.post(`/usuarios/${id}/seguir`); await cargarSeguidores(); }
    catch { await cargarSeguidores(); setErrorBoton("No se pudo seguir al usuario."); }
    finally { setCargandoBoton(false); }
  };
  const handleDejarSeguir = async () => {
    setCargandoBoton(true); setErrorBoton("");
    try { await api.post(`/usuarios/${id}/dejar-seguir`); await cargarSeguidores(); }
    catch { await cargarSeguidores(); setErrorBoton("No se pudo dejar de seguir."); }
    finally { setCargandoBoton(false); }
  };

  const abrirModal = () => {
    setModalAbierto(true);
    setCargandoLista(true);
    api.get(`/usuarios/${id}/seguidores-lista`)
      .then(res => setListaSeguidores(res.data.seguidores || []))
      .finally(() => setCargandoLista(false));
  };

  useEffect(() => {
    setCargandoEventosFinalizados(true);
    api.get(`/usuarios/${id}/eventos-finalizados-creados`)
      .then(res => setEventosFinalizados(res.data.eventos || []))
      .finally(() => setCargandoEventosFinalizados(false));
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col bg-crema-100">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-piedra-500">Cargando usuario…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen flex flex-col bg-crema-100">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-piedra-500">Usuario no encontrado.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const fechaAlta = usuario.createdAt
    ? new Date(usuario.createdAt).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
    : "";
  const inicial = usuario.nombre?.[0]?.toUpperCase() || "U";
  const esPropio = usuarioLog && usuarioLog.id === usuario.id;

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
            <p className="text-crema-100/80 text-sm mb-6">{usuario.email}</p>
            <div className="flex items-center justify-center gap-6 text-sm mb-6">
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
            {usuarioLog && !esPropio && !cargandoSeg && (
              cargandoBoton ? (
                <button className="px-6 py-2 rounded-full bg-white/20 text-white text-sm" disabled>Procesando…</button>
              ) : sigue ? (
                <button onClick={handleDejarSeguir} className="px-6 py-2 rounded-full bg-white/15 text-white text-sm font-medium hover:bg-white/25 border border-white/30 transition-colors">
                  Dejar de seguir
                </button>
              ) : (
                <button onClick={handleSeguir} className="px-6 py-2 rounded-full bg-white text-jaen-700 text-sm font-medium hover:bg-crema-100 transition-colors">
                  Seguir
                </button>
              )
            )}
            {errorBoton && <p className="text-red-200 text-xs mt-2">{errorBoton}</p>}
          </div>
        </section>

        <PerfilSecciones
          usuario={usuario}
          editable={false}
          eventosFinalizadosCreados={eventosFinalizados}
          cargandoEventosFinalizados={cargandoEventosFinalizados}
        />
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
                <p className="text-piedra-500">Sin seguidores aún.</p>
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

export default PerfilUsuario;
