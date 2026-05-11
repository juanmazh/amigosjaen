import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import AuthContext from "../context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PerfilSecciones from "./components/PerfilSecciones";
import Avatar from "./components/Avatar";
import api from "../api";

const Perfil = () => {
  const { usuario, actualizarUsuario } = useContext(AuthContext);
  const [seguidores, setSeguidores] = useState(0);
  const [cargandoSeg, setCargandoSeg] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [listaSeguidores, setListaSeguidores] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(false);

  const editarAvatar = async () => {
    const { value: url, isConfirmed } = await Swal.fire({
      title: "Cambiar foto de perfil",
      input: "url",
      inputLabel: "URL de la imagen",
      inputValue: usuario.avatarUrl || "",
      inputPlaceholder: "https://...",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      showDenyButton: !!usuario.avatarUrl,
      denyButtonText: "Quitar foto",
      inputValidator: (value) => {
        if (!value) return null; // permitir vacío (quita)
        try { new URL(value); return null; } catch { return "URL no válida"; }
      },
    });

    if (!isConfirmed && url === undefined) return;
    const nuevoAvatar = isConfirmed ? (url || "") : ""; // si denegó, vacío

    try {
      const res = await api.put("/auth/perfil", { avatarUrl: nuevoAvatar });
      actualizarUsuario({ avatarUrl: res.data.avatarUrl });
      Swal.fire("Listo", "Foto de perfil actualizada", "success");
    } catch (e) {
      Swal.fire("Error", e.response?.data?.msg || "No se pudo actualizar", "error");
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-crema-100">
      <Header />
      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-jaen-700 to-jaen-500 text-white">
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="rounded-full border-4 border-white/30 overflow-hidden">
                <Avatar nombre={usuario.nombre} url={usuario.avatarUrl} size={88} className="border-0" />
              </div>
              <button
                onClick={editarAvatar}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white text-jaen-600 hover:bg-crema-100 shadow-md flex items-center justify-center transition-colors"
                title="Cambiar foto"
                aria-label="Cambiar foto de perfil"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </button>
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
                      <Avatar nombre={u.nombre} url={u.avatarUrl} size={40} />
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
