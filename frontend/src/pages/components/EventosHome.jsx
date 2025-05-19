import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

function EventosHome() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    api.get("/eventos")
      .then(res => setEventos(res.data.slice(0, 6))) // Solo los 6 más próximos
      .catch(err => console.error("Error al obtener eventos:", err));
  }, []);

  if (eventos.length === 0) {
    return <p className="mb-4">No hay eventos próximos.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {eventos.map(evento => (
        <Link to={`/eventos/${evento.id}`} key={evento.id} className="bg-white shadow-md rounded-xl p-4 hover:bg-purple-50 transition">
          <h3 className="text-lg font-bold text-purple-700">{evento.titulo}</h3>
          <p className="text-gray-600 mb-2">{evento.descripcion.slice(0, 80)}...</p>
          <p className="text-sm text-gray-400">Fecha: {new Date(evento.fecha).toLocaleDateString()}</p>
        </Link>
      ))}
    </div>
  );
}

export default EventosHome;
