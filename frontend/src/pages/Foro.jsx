import { useEffect, useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowRight } from 'react-icons/fa';
import Header from "./components/Header";
import Footer from "./components/Footer";

function Foro() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/publicaciones')
      .then(res => setPublicaciones(res.data))
      .catch(err => console.error('Error al obtener publicaciones:', err));
  }, []);

  const filteredPublicaciones = publicaciones.filter(pub => {
    const q = searchTerm.toLowerCase();
    const matchesTitulo = pub.titulo.toLowerCase().includes(q);
    const matchesTag = pub.tags && pub.tags.some(tag => tag.nombre.toLowerCase().includes(q));
    return matchesTitulo || matchesTag;
  });

  return (
    <div className="min-h-screen flex flex-col bg-crema-100">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-block text-xs uppercase tracking-[0.2em] text-jaen-500 font-semibold mb-2">
              Conversaciones
            </span>
            <h1 className="font-display text-5xl text-jaen-700 font-semibold">Foro</h1>
          </div>
          <button
            onClick={() => navigate('/crear-publicacion')}
            className="px-5 py-2.5 rounded-full bg-jaen-500 text-white font-medium hover:bg-jaen-600 shadow-sm hover:shadow-md transition-all"
          >
            Nueva publicación
          </button>
        </div>

        <div className="relative mb-8">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-piedra-500/60" />
          <input
            type="text"
            placeholder="Buscar por título o etiqueta…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-crema-300 bg-white focus:border-jaen-400 focus:ring-2 focus:ring-jaen-200 outline-none transition-all"
          />
        </div>

        {filteredPublicaciones.length === 0 ? (
          <div className="bg-white border border-crema-300 rounded-2xl p-12 text-center">
            <p className="text-piedra-500">No hay publicaciones aún.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPublicaciones.map(pub => (
              <Link
                to={`/publicaciones/${pub.id}`}
                key={pub.id}
                className="group block bg-white border border-crema-300 rounded-2xl p-6 hover:border-jaen-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl font-semibold text-piedra-900 group-hover:text-jaen-600 transition-colors mb-2">
                      {pub.titulo}
                    </h3>
                    <p className="text-piedra-500 text-sm leading-relaxed">
                      {pub.contenido.slice(0, 150)}{pub.contenido.length > 150 ? '…' : ''}
                    </p>
                    <div className="flex items-center flex-wrap gap-2 mt-4 pt-4 border-t border-crema-200">
                      <span className="text-xs text-piedra-500/70">
                        por <span className="text-jaen-600 font-medium">{pub.autorNombre}</span>
                      </span>
                      {pub.tags?.map((tag) => (
                        <span key={tag.id} className="text-xs px-2 py-0.5 rounded-full bg-jaen-50 text-jaen-600">
                          #{tag.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <FaArrowRight className="text-piedra-500/40 group-hover:text-jaen-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Foro;
