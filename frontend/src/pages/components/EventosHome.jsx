import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

function EventosHome() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    api.get("/eventos")
      .then(res => setEventos(res.data.slice(0, 6)))
      .catch(err => console.error("Error al obtener eventos:", err));
  }, []);

  if (eventos.length === 0) {
    return (
      <div className="bg-white border border-crema-300 rounded-2xl p-8 text-center">
        <p className="text-piedra-500">No hay eventos próximos por ahora.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {eventos.map(evento => {
        let imagen = null;
        if (Array.isArray(evento.imagenes)) {
          imagen = evento.imagenes[0];
        } else if (evento.imagenes) {
          try {
            const imgs = JSON.parse(evento.imagenes);
            imagen = Array.isArray(imgs) ? imgs[0] : null;
          } catch {
            imagen = null;
          }
        }
        return (
          <Link
            to={`/eventos/${evento.id}`}
            key={evento.id}
            className="group bg-white border border-crema-300 rounded-2xl overflow-hidden hover:border-jaen-300 hover:shadow-md transition-all"
          >
            {imagen ? (
              <div className="aspect-[16/10] overflow-hidden bg-crema-200">
                <img
                  src={imagen}
                  alt={evento.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="aspect-[16/10] bg-gradient-to-br from-jaen-100 to-olivo-100 flex items-center justify-center">
                <span className="font-display text-4xl text-jaen-300">AJ</span>
              </div>
            )}
            <div className="p-5">
              <p className="text-xs uppercase tracking-wider text-ambar-700 font-semibold mb-2">
                {new Date(evento.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'long' })}
              </p>
              <h3 className="font-display text-xl font-semibold text-piedra-900 group-hover:text-jaen-600 transition-colors mb-2">
                {evento.titulo}
              </h3>
              <p className="text-sm text-piedra-500 leading-relaxed">
                {evento.descripcion.slice(0, 90)}{evento.descripcion.length > 90 ? '…' : ''}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default EventosHome;
