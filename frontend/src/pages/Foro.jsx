import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { FaEye } from "react-icons/fa";

function Foro() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [etiquetas, setEtiquetas] = useState([]);
  const [publicacionEtiquetas, setPublicacionEtiquetas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/publicaciones')
      .then(res => setPublicaciones(res.data))
      .catch(err => console.error('Error al obtener publicaciones:', err));
    // Obtener todas las etiquetas
    api.get('/etiquetas')
      .then(res => setEtiquetas(res.data))
      .catch(err => console.error('Error al obtener etiquetas:', err));
  }, []);

  // Filtrar publicaciones por título o etiquetas
  const filteredPublicaciones = publicaciones.filter(pub => {
    const matchesTitulo = pub.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    // Buscar por etiquetas asociadas (asumiendo que pub.tags existe y es un array de objetos {nombre})
    const matchesTag = pub.tags && pub.tags.some(tag => tag.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTitulo || matchesTag;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 to-purple-200">
      <Header />
      <main className="flex-grow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-extrabold text-purple-700 mb-8 text-center drop-shadow-lg tracking-tight">Foro</h1>
          <button
            onClick={() => navigate('/crear-publicacion')}
            className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-green-500 text-white px-4 py-2 text-base font-medium hover:bg-green-600 ml-4"
          >
            Crea una publicación
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por título o etiqueta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
          />
        </div>
        <div className="space-y-4">
          {filteredPublicaciones.map(pub => (
            <div key={pub.id} className="flex items-center justify-between bg-white shadow-md rounded-xl p-4">
              <div>
                <h3 className="text-lg font-bold">{pub.titulo}</h3>
                <p className="text-gray-600">{pub.contenido.slice(0, 100)}...</p>
                <p className="text-sm text-gray-400 mt-2">Autor: {pub.autorNombre}</p>
                {/* Mostrar etiquetas asociadas */}
                {pub.tags && pub.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pub.tags.map((tag) => (
                      <span key={tag.id} className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs">
                        #{tag.nombre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Link to={`/publicaciones/${pub.id}`} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2" title="Ver detalles">
                <FaEye />
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Foro;
