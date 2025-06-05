import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import api from "../api";
import Swal from "sweetalert2";

const Valoraciones = () => {
  const { usuario } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [valoraciones, setValoraciones] = useState({}); // { eventoId: { valor, comentario } }
  const [enviando, setEnviando] = useState({}); // { eventoId: true/false }

  useEffect(() => {
    if (!usuario) return;
    setCargando(true);
    api
      .get(`/usuarios/${usuario.id}/eventos-asistidos`)
      .then((res) => {
        setEventos(res.data.eventos || []);
        // Cargar valoraciones existentes para cada evento
        (res.data.eventos || []).forEach((evento) => {
          api
            .get(`/valoraciones/${evento.id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((vres) => {
              if (vres.data.valoracion) {
                setValoraciones((prev) => ({
                  ...prev,
                  [evento.id]: {
                    valor: vres.data.valoracion.valor,
                    comentario: vres.data.valoracion.comentario || "",
                  },
                }));
              }
            });
        });
      })
      .finally(() => setCargando(false));
  }, [usuario]);

  const handleValorChange = (eventoId, valor) => {
    setValoraciones((prev) => ({
      ...prev,
      [eventoId]: { ...prev[eventoId], valor },
    }));
  };

  const handleComentarioChange = (eventoId, comentario) => {
    setValoraciones((prev) => ({
      ...prev,
      [eventoId]: { ...prev[eventoId], comentario },
    }));
  };

  const handleEnviar = async (eventoId) => {
    const valor = valoraciones[eventoId]?.valor;
    const comentario = valoraciones[eventoId]?.comentario || "";
    if (!valor || valor < 1 || valor > 5) {
      Swal.fire("Error", "Introduce una valoración entre 1 y 5", "error");
      return;
    }
    setEnviando((prev) => ({ ...prev, [eventoId]: true }));
    try {
      await api.post(
        "/valoraciones",
        { eventoId, valor, comentario },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      Swal.fire("¡Gracias!", "Tu valoración se ha guardado", "success");
    } catch (err) {
      Swal.fire("Error", "No se pudo guardar la valoración", "error");
    } finally {
      setEnviando((prev) => ({ ...prev, [eventoId]: false }));
    }
  };

  if (!usuario) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-pink-100 to-purple-200">
        <Header />
        <div className="max-w-xl mx-auto mt-10">Debes iniciar sesión para ver tus valoraciones.</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex flex-col">
      <Header />
      <div className="flex-1 max-w-2xl mx-auto mt-8 mb-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">Mis valoraciones de eventos</h2>
        {cargando ? (
          <div>Cargando eventos...</div>
        ) : eventos.length === 0 ? (
          <div>No tienes eventos finalizados para valorar.</div>
        ) : (
          <ul className="space-y-4">
            {eventos.map((evento) => (
              <li key={evento.id} className="border rounded-lg p-4 bg-purple-50">
                <div className="font-semibold text-lg text-purple-800">{evento.titulo}</div>
                <div className="text-gray-600">{evento.descripcion}</div>
                <div className="text-sm text-gray-500 mb-2">Finalizado el {evento.fecha?.slice(0, 10)}</div>
                <div className="mt-2">
                  <span className="text-gray-700">Valora este evento:</span>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="ml-2 border rounded px-2 py-1 w-16"
                    placeholder="1-5"
                    value={valoraciones[evento.id]?.valor || ""}
                    onChange={e => handleValorChange(evento.id, e.target.value)}
                  />
                  <button
                    className="ml-2 bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 disabled:opacity-60"
                    onClick={() => handleEnviar(evento.id)}
                    disabled={enviando[evento.id]}
                  >
                    {valoraciones[evento.id]?.valor ? "Actualizar" : "Enviar"}
                  </button>
                  <textarea
                    className="block mt-2 w-full border rounded px-2 py-1"
                    placeholder="Comentario (opcional)"
                    value={valoraciones[evento.id]?.comentario || ""}
                    onChange={e => handleComentarioChange(evento.id, e.target.value)}
                    rows={2}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Valoraciones;
