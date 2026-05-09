import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import api from "../api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthContext from "../context/AuthContext";

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const { usuario, cargando } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/eventos")
      .then((res) => setEventos(res.data))
      .catch((err) => console.error("Error al cargar eventos:", err));
  }, []);

  const eventosFiltrados = eventos.filter((evento) => {
    const q = filtro.toLowerCase();
    const matchesTitulo = evento.titulo.toLowerCase().includes(q);
    const matchesTag = evento.tags && evento.tags.some(tag => tag.nombre.toLowerCase().includes(q));
    const fechaHora = evento.fecha
      ? new Date(evento.fecha).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : '';
    return matchesTitulo || matchesTag || fechaHora.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen flex flex-col bg-crema-100">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-block text-xs uppercase tracking-[0.2em] text-jaen-500 font-semibold mb-2">
              La agenda de Jaén
            </span>
            <h1 className="font-display text-5xl text-jaen-700 font-semibold">Eventos</h1>
          </div>
          <button
            onClick={() => (!cargando && !usuario ? navigate("/login") : navigate("/crear-evento"))}
            className="px-5 py-2.5 rounded-full bg-jaen-500 text-white font-medium hover:bg-jaen-600 shadow-sm hover:shadow-md transition-all"
          >
            Crear evento
          </button>
        </div>

        <div className="relative mb-10">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-piedra-500/60" />
          <input
            type="text"
            placeholder="Buscar por título, etiqueta o fecha…"
            className="w-full pl-11 pr-4 py-3 rounded-full border border-crema-300 bg-white focus:border-jaen-400 focus:ring-2 focus:ring-jaen-200 outline-none transition-all"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        {eventosFiltrados.length === 0 ? (
          <div className="bg-white border border-crema-300 rounded-2xl p-12 text-center">
            <p className="text-piedra-500">No hay eventos que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventosFiltrados.map((evento) => {
              let imagenes = [];
              if (Array.isArray(evento.imagenes)) imagenes = evento.imagenes;
              else if (evento.imagenes) {
                try { imagenes = JSON.parse(evento.imagenes); } catch { imagenes = []; }
              }
              return (
                <div
                  key={evento.id}
                  className="bg-white border border-crema-300 rounded-2xl overflow-hidden flex flex-col hover:border-jaen-300 hover:shadow-md transition-all"
                >
                  {imagenes[0] ? (
                    <div className="aspect-[16/10] overflow-hidden bg-crema-200">
                      <img src={imagenes[0]} alt={evento.titulo} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-gradient-to-br from-jaen-100 to-olivo-100 flex items-center justify-center">
                      <span className="font-display text-4xl text-jaen-300">AJ</span>
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-xs uppercase tracking-wider text-ambar-700 font-semibold mb-2">
                      {evento.fecha
                        ? new Date(evento.fecha).toLocaleString('es-ES', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })
                        : ''}
                    </p>
                    <h2 className="font-display text-xl font-semibold text-piedra-900 mb-2">
                      {evento.titulo}
                    </h2>
                    <p className="text-sm text-piedra-500 leading-relaxed flex-1">
                      {evento.descripcion.slice(0, 110)}{evento.descripcion.length > 110 ? '…' : ''}
                    </p>

                    {evento.tags && evento.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {evento.tags.map((tag) => (
                          <button
                            key={tag.id}
                            onClick={() => setFiltro(tag.nombre)}
                            className="text-xs px-2.5 py-1 rounded-full bg-jaen-50 text-jaen-600 hover:bg-jaen-100 transition-colors"
                            type="button"
                          >
                            #{tag.nombre}
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/eventos/${evento.id}`)}
                      className="mt-5 inline-flex items-center justify-center gap-2 text-jaen-600 hover:text-jaen-700 font-medium text-sm group"
                    >
                      Ver detalles
                      <FaArrowRight className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Eventos;
