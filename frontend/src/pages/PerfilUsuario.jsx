import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PerfilSecciones from "./components/PerfilSecciones";
import { useAuth } from "../context/AuthContext";
// pagina de perfil de usuario que todo el mundo visita
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
      .then(res => {
        setUsuario(res.data);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [id]);

  // Función para cargar seguidores y estado de seguimiento
  const cargarSeguidores = () => {
    setCargandoSeg(true);
    api.get(`/usuarios/${id}/seguidores`)
      .then(res => {
        setSeguidores(res.data.seguidores);
        // Solo actualizar "sigue" si hay usuario logueado
        if (usuarioLog && usuarioLog.id !== Number(id)) {
          setSigue(res.data.sigue);
        } else {
          setSigue(false);
        }
      })
      .finally(() => setCargandoSeg(false));
  };

  useEffect(() => {
    if (!id || cargandoAuth) return;
    cargarSeguidores();
  }, [id, usuarioLog, cargandoAuth]); 
  const handleSeguir = async () => {
    setCargandoBoton(true);
    setErrorBoton("");
    try {
      await api.post(`/usuarios/${id}/seguir`);
      await cargarSeguidores(); // Espera a que termine antes de continuar
    } catch (err) {
      await cargarSeguidores(); // Asegura recarga aunque haya error
      setErrorBoton("No se pudo seguir al usuario. Puede que ya lo sigas.");
    } finally {
      setCargandoBoton(false);
    }
  };
  const handleDejarSeguir = async () => {
    setCargandoBoton(true);
    setErrorBoton("");
    try {
      await api.post(`/usuarios/${id}/dejar-seguir`);
      await cargarSeguidores();
    } catch (err) {
      await cargarSeguidores();
      setErrorBoton("No se pudo dejar de seguir al usuario.");
    } finally {
      setCargandoBoton(false);
    }
  };

  const abrirModalSeguidores = () => {
    setModalAbierto(true);
    setCargandoLista(true);
    api.get(`/usuarios/${id}/seguidores-lista`)
      .then(res => setListaSeguidores(res.data.seguidores || []))
      .finally(() => setCargandoLista(false));
  };

  const cerrarModalSeguidores = () => {
    setModalAbierto(false);
    setListaSeguidores([]);
  };

  useEffect(() => {
    setCargandoEventosFinalizados(true);
    api.get(`/usuarios/${id}/eventos-finalizados-creados`)
      .then(res => setEventosFinalizados(res.data.eventos || []))
      .finally(() => setCargandoEventosFinalizados(false));
  }, [id]);

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
                    <button className="text-purple-700 font-bold hover:underline" onClick={abrirModalSeguidores}>
                      {seguidores}
                    </button>
                  )}
                  {usuarioLog && usuario && usuarioLog.id !== usuario.id && !cargandoSeg && (
                    cargandoBoton ? (
                      <button className="mt-2 px-4 py-1 rounded bg-gray-300 text-gray-700 flex items-center justify-center" disabled>
                        <svg className="animate-spin h-5 w-5 mr-2 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Procesando...
                      </button>
                    ) : (
                      sigue ? (
                        <button
                          className="mt-2 px-4 py-1 rounded bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition-colors duration-200 border border-red-600 flex items-center gap-2"
                          onClick={handleDejarSeguir}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Dejar de seguir
                        </button>
                      ) : (
                        <button className="mt-2 px-4 py-1 rounded bg-purple-600 text-white hover:bg-purple-700" onClick={handleSeguir}>
                          Seguir
                        </button>
                      )
                    )
                  )}
                  {errorBoton && (
                    <div className="text-red-500 text-sm mt-2">{errorBoton}</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Usuario no encontrado.</p>
          )}
        </div>
        {usuario && (
          <PerfilSecciones 
            usuario={usuario} 
            editable={false} 
            eventosFinalizadosCreados={eventosFinalizados}
            cargandoEventosFinalizados={cargandoEventosFinalizados}
          />
        )}
      </main>
      <Footer />

      {/* Modal de seguidores */}
      {modalAbierto && (
        <div className="fixed inset-0  bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl" onClick={cerrarModalSeguidores}>&times;</button>
            <h3 className="text-lg font-bold mb-4 text-purple-700">Seguidores</h3>
            {cargandoLista ? (
              <p>Cargando...</p>
            ) : listaSeguidores.length === 0 ? (
              <p className="text-gray-500">No tiene seguidores.</p>
            ) : (
              <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                {listaSeguidores.map(user => (
                  <li key={user.id} className="py-2">
                    <span className="font-semibold text-purple-700">{user.nombre}</span>
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

export default PerfilUsuario;
