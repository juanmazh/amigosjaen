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

  useEffect(() => {
    api.get(`/usuarios/${id}`)
      .then(res => {
        setUsuario(res.data);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setCargandoSeg(true);
    api.get(`/usuarios/${id}/seguidores`)
      .then(res => {
        setSeguidores(res.data.seguidores);
        setSigue(res.data.sigue);
      })
      .finally(() => setCargandoSeg(false));
  }, [id, usuarioLog]);

  const handleSeguir = async () => {
    await api.post(`/usuarios/${id}/seguir`);
    setSigue(true);
    setSeguidores(seguidores + 1);
  };
  const handleDejarSeguir = async () => {
    await api.post(`/usuarios/${id}/dejar-seguir`);
    setSigue(false);
    setSeguidores(seguidores - 1);
  };

  let fechaAlta = "";
  if (usuario && usuario.createdAt) {
    const fecha = new Date(usuario.createdAt);
    fechaAlta = fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10">
          {cargando ? (
            <p className="text-center">Cargando usuario...</p>
          ) : usuario ? (
            <>
              <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">{usuario.nombre}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="text-gray-800">{usuario.email}</span>
                </div>
                {fechaAlta && (
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-gray-700">Usuario desde:</span>
                    <span className="text-gray-800">{fechaAlta}</span>
                  </div>
                )}
                <div className="flex flex-col items-center col-span-full">
                  <span className="font-semibold text-gray-700">Seguidores:</span>
                  {cargandoSeg ? (
                    <span className="text-gray-500">Cargando...</span>
                  ) : (
                    <span className="text-purple-700 font-bold">{seguidores}</span>
                  )}
                  {usuarioLog && usuario && usuarioLog.id !== usuario.id && !cargandoSeg && (
                    sigue ? (
                      <button className="mt-2 px-4 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400" onClick={handleDejarSeguir}>
                        Dejar de seguir
                      </button>
                    ) : (
                      <button className="mt-2 px-4 py-1 rounded bg-purple-600 text-white hover:bg-purple-700" onClick={handleSeguir}>
                        Seguir
                      </button>
                    )
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Usuario no encontrado.</p>
          )}
        </div>
        {usuario && <PerfilSecciones usuario={usuario} editable={false} />}
      </main>
      <Footer />
    </div>
  );
};

export default PerfilUsuario;
