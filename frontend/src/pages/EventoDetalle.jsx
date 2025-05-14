import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Header from "./components/Header";
import Footer from "./components/Footer";

function EventoDetalle() {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);

  useEffect(() => {
    const cargarEvento = async () => {
      try {
        const res = await api.get(`/eventos/${id}`);
        setEvento(res.data);
      } catch (err) {
        console.error("Error al cargar el evento:", err);
      }
    };
    cargarEvento();
  }, [id]);

  if (!evento) {
    return <p>Cargando evento...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4 text-purple-600">{evento.titulo}</h1>
        <p className="mb-2">{evento.descripcion}</p>
        <p className="text-sm text-gray-500 mb-2">
          Fecha: {new Date(evento.fecha).toLocaleDateString()}
        </p>
        <p className={`text-sm font-bold ${evento.activo ? 'text-green-500' : 'text-red-500'}`}>
          {evento.activo ? 'Activo' : 'Inactivo'}
        </p>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {evento.imagenes && evento.imagenes.map((imagen, index) => (
            <img
              key={index}
              src={imagen}
              alt={`Evento ${evento.titulo}`}
              className="w-full h-64 object-cover rounded"
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EventoDetalle;
