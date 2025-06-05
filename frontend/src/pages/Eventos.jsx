import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
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
    const cargarEventos = async () => {
      try {
        const res = await api.get("/eventos");
        setEventos(res.data);
      } catch (err) {
        console.error("Error al cargar eventos:", err);
      }
    };
    cargarEventos();
  }, []);

  const handleEventoCreado = (nuevoEvento) => {
    setEventos([nuevoEvento, ...eventos]);
  };

  const eventosFiltrados = eventos.filter((evento) => {
    const matchesTitulo = evento.titulo.toLowerCase().includes(filtro.toLowerCase());
    const matchesTag = evento.tags && evento.tags.some(tag => tag.nombre.toLowerCase().includes(filtro.toLowerCase()));
    const fechaHora = evento.fecha ? new Date(evento.fecha).toLocaleString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
    const matchesFechaHora = fechaHora.toLowerCase().includes(filtro.toLowerCase());
    return matchesTitulo || matchesTag || matchesFechaHora;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 to-purple-200">
      <Header />
      <div className="flex-grow p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-extrabold text-purple-700 mb-8 text-center drop-shadow-lg tracking-tight">
            Eventos
          </h1>
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-green-500 text-white px-4 py-2 text-base font-medium hover:bg-green-600 ml-4"
            onClick={() => {
              if (!cargando && !usuario) {
                navigate("/login");
              } else {
                navigate("/crear-evento");
              }
            }}
          >
            Crear Evento
          </button>
        </div>
        <input
          type="text"
          placeholder="Filtrar eventos..."
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 bg-white"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventosFiltrados.map((evento) => (
            <div
              key={evento.id}
              className="bg-white shadow p-4 rounded-xl text-center"
            >
              <h2 className="text-xl font-bold text-purple-600">
                {evento.titulo}
              </h2>
              <p>{evento.descripcion}</p>
              <p className="text-sm text-gray-500">
                {/* Mostrar fecha y hora en formato local */}
                {evento.fecha ? new Date(evento.fecha).toLocaleString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
              </p>
              <p
                className={`text-sm font-bold ${
                  evento.activo ? "text-green-500" : "text-red-500"
                }`}
              >
                {evento.activo ? "Activo" : "Inactivo"}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {/* Asegura que imagenes sea un array */}
                {(() => {
                  let imagenes = [];
                  if (Array.isArray(evento.imagenes)) {
                    imagenes = evento.imagenes;
                  } else if (evento.imagenes) {
                    try {
                      imagenes = JSON.parse(evento.imagenes);
                    } catch {
                      imagenes = [];
                    }
                  }
                  return imagenes.map((imagen, index) => (
                    <img
                      key={index}
                      src={imagen}
                      alt={`Evento ${evento.titulo}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ));
                })()}
              </div>
              {evento.tags && evento.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {evento.tags.map((tag) => (
                    <button
                      key={tag.id}
                      className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs hover:bg-purple-300 transition"
                      onClick={() => setFiltro(tag.nombre)}
                      type="button"
                    >
                      #{tag.nombre}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2 flex items-center gap-2"
                  onClick={() => navigate(`/eventos/${evento.id}`)}
                  title="Ver detalles"
                >
                  <FaEye />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Eventos;
