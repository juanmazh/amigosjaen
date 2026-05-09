import React, { useContext, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import api from "../api";
import Swal from "sweetalert2";

const StarRating = ({ valor, onChange }) => {
  const [hover, setHover] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-1">
      {stars.map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="p-1 transition-transform hover:scale-110"
          aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
        >
          <FaStar className={`text-2xl transition-colors ${(hover || valor) >= n ? 'text-ambar-500' : 'text-crema-300'}`} />
        </button>
      ))}
    </div>
  );
};

const Valoraciones = () => {
  const { usuario } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [valoraciones, setValoraciones] = useState({});
  const [enviando, setEnviando] = useState({});

  useEffect(() => {
    if (!usuario) return;
    setCargando(true);
    api.get(`/usuarios/${usuario.id}/eventos-asistidos`)
      .then((res) => {
        const lista = res.data.eventos || [];
        setEventos(lista);
        lista.forEach((evento) => {
          api.get(`/valoraciones/${evento.id}`).then((vres) => {
            if (vres.data.valoracion) {
              setValoraciones((prev) => ({
                ...prev,
                [evento.id]: { valor: vres.data.valoracion.valor, comentario: vres.data.valoracion.comentario || "" },
              }));
            }
          }).catch(() => {});
        });
      })
      .finally(() => setCargando(false));
  }, [usuario]);

  const handleEnviar = async (eventoId) => {
    const valor = valoraciones[eventoId]?.valor;
    const comentario = valoraciones[eventoId]?.comentario || "";
    if (!valor || valor < 1 || valor > 5) {
      Swal.fire("Error", "Selecciona una valoración entre 1 y 5 estrellas", "error");
      return;
    }
    setEnviando((prev) => ({ ...prev, [eventoId]: true }));
    try {
      await api.post("/valoraciones", { eventoId, valor, comentario });
      Swal.fire("¡Gracias!", "Tu valoración se ha guardado", "success");
    } catch {
      Swal.fire("Error", "No se pudo guardar la valoración", "error");
    } finally {
      setEnviando((prev) => ({ ...prev, [eventoId]: false }));
    }
  };

  if (!usuario) {
    return (
      <div className="min-h-screen flex flex-col bg-crema-100">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-piedra-500">Inicia sesión para ver tus valoraciones.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-crema-100">
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <div className="mb-8">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-jaen-500 font-semibold mb-2">
            Tu opinión cuenta
          </span>
          <h1 className="font-display text-5xl text-jaen-700 font-semibold">Mis valoraciones</h1>
        </div>

        {cargando ? (
          <p className="text-piedra-500">Cargando eventos…</p>
        ) : eventos.length === 0 ? (
          <div className="bg-white border border-crema-300 rounded-2xl p-12 text-center">
            <p className="text-piedra-500">No tienes eventos finalizados para valorar.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {eventos.map((evento) => (
              <div key={evento.id} className="bg-white border border-crema-300 rounded-2xl p-6">
                <h2 className="font-display text-xl text-piedra-900 font-semibold mb-1">{evento.titulo}</h2>
                <p className="text-sm text-piedra-500 mb-1">{evento.descripcion}</p>
                <p className="text-xs text-piedra-500/70 mb-4">Finalizado el {evento.fecha?.slice(0, 10)}</p>

                <div className="space-y-4 pt-4 border-t border-crema-200">
                  <div>
                    <p className="text-sm font-medium text-piedra-700 mb-2">Tu valoración</p>
                    <StarRating
                      valor={valoraciones[evento.id]?.valor || 0}
                      onChange={(v) => setValoraciones(prev => ({ ...prev, [evento.id]: { ...prev[evento.id], valor: v } }))}
                    />
                  </div>
                  <textarea
                    className="w-full px-4 py-2.5 rounded-lg border border-crema-300 bg-crema-50 focus:bg-white focus:border-jaen-400 focus:ring-2 focus:ring-jaen-200 outline-none transition-all text-sm"
                    placeholder="Cuéntanos qué te pareció (opcional)"
                    value={valoraciones[evento.id]?.comentario || ""}
                    onChange={e => setValoraciones(prev => ({ ...prev, [evento.id]: { ...prev[evento.id], comentario: e.target.value } }))}
                    rows={3}
                  />
                  <button
                    onClick={() => handleEnviar(evento.id)}
                    disabled={enviando[evento.id]}
                    className="px-5 py-2 rounded-full bg-jaen-500 text-white font-medium hover:bg-jaen-600 transition-colors disabled:opacity-60"
                  >
                    {enviando[evento.id] ? "Guardando…" : valoraciones[evento.id]?.valor ? "Actualizar" : "Enviar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Valoraciones;
