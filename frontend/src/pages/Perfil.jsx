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
    api
      .get(`/usuarios/${usuario.id}/seguidores`)
      .then((res) => setSeguidores(res.data.seguidores))
      .finally(() => setCargandoSeg(false));
  }, [usuario]);

  const abrirModalSeguidores = () => {
    setModalAbierto(true);
    setCargandoLista(true);
    api
      .get(`/usuarios/${usuario.id}/seguidores-lista`)
      .then((res) => setListaSeguidores(res.data.seguidores || []))
      .finally(() => setCargandoLista(false));
  };

  const cerrarModalSeguidores = () => {
    setModalAbierto(false);
    setListaSeguidores([]);
  };

  if (!usuario)
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-pink-100 to-purple-200">
        <Header />
        <div className="max-w-xl mx-auto mt-10">
          Debes iniciar sesión para ver tu perfil.
        </div>
        <Footer />
      </div>
    );

  // Formatear fecha de creación
  let fechaAlta = "";
  if (usuario.createdAt) {
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
          <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
            {usuario.nombre}
          </h2>
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
                <button
                  className="text-purple-700 font-bold hover:underline"
                  onClick={abrirModalSeguidores}
                >
                  {seguidores}
                </button>
              )}
            </div>
          </div>
        </div>
        <PerfilSecciones
          usuario={usuario}
          editable={true}
          mostrarEventosPorEstado={true}
        />
      </main>
      <Footer />

      {/* Modal de seguidores */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={cerrarModalSeguidores}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4 text-purple-700">Seguidores</h3>
            {cargandoLista ? (
              <p>Cargando...</p>
            ) : listaSeguidores.length === 0 ? (
              <p className="text-gray-500">No tienes seguidores.</p>
            ) : (
              <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                {listaSeguidores.map((user) => (
                  <li key={user.id} className="py-2">
                    <span className="font-semibold text-purple-700">
                      {user.nombre}
                    </span>
                    <span className="text-gray-500 ml-2">{user.email}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;
