import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";

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
  }, []);
  // Obtener etiquetas, en proceso de depuración
  const filteredPublicaciones = publicaciones.filter(pub => {
    const matchesTitulo = pub.titulo.toLowerCase().includes(searchTerm.toLowerCase());

    const etiquetaIds = etiquetas
      .filter(etiqueta => etiqueta.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(etiqueta => etiqueta.id);

    const matchesEtiqueta = publicacionEtiquetas
      .filter(pe => etiquetaIds.includes(pe.etiquetumid))
      .some(pe => pe.publicacionid === pub.id);

    return matchesTitulo || matchesEtiqueta;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Foro</h1>
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => navigate('/crear-publicacion')}
            className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-green-500 text-white px-4 py-2 text-base font-medium hover:bg-green-600"
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
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="space-y-4">
          {filteredPublicaciones.map(pub => (
            <div key={pub.id} className="flex items-center justify-between bg-white shadow-md rounded-xl p-4">
              <div>
                <h3 className="text-lg font-bold">{pub.titulo}</h3>
                <p className="text-gray-600">{pub.contenido.slice(0, 100)}...</p>
                <p className="text-sm text-gray-400 mt-2">Autor: {pub.autorNombre}</p>
              </div>
              <Link to={`/publicaciones/${pub.id}`} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                Ver más
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
