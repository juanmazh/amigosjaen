import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Header from "./components/Header";
import Footer from "./components/Footer";

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [filtro, setFiltro] = useState("");

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

  const eventosFiltrados = eventos.filter((evento) =>
    evento.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4 text-purple-600">Eventos</h1>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mb-4"
          onClick={() => navigate("/crear-evento")}
        >
          Crear Evento
        </button>
        <input
          type="text"
          placeholder="Filtrar eventos..."
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventosFiltrados.map((evento) => (
            <div key={evento.id} className="bg-white shadow p-4 rounded-xl text-center">
              <h2 className="text-xl font-bold text-purple-600">{evento.titulo}</h2>
              <p>{evento.descripcion}</p>
              <p className="text-sm text-gray-500">{new Date(evento.fecha).toLocaleDateString()}</p>
              <p className={`text-sm font-bold ${evento.activo ? 'text-green-500' : 'text-red-500'}`}>
                {evento.activo ? 'Activo' : 'Inactivo'}
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
                    <img key={index} src={imagen} alt={`Evento ${evento.titulo}`} className="w-full h-32 object-cover rounded" />
                  ));
                })()}
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
                onClick={() => navigate(`/eventos/${evento.id}`)}
              >
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Eventos;
