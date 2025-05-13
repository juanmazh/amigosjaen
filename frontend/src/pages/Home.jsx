// src/import Header from "./components/Header";ages/Home.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import UserMenu from './components/UserMenu';
import CrearPublicacion from "./components/CrearPublicacion";
import Header from "./components/Header";
import Footer from "./components/Footer";

function Home() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/publicaciones')
      .then(res => setPublicaciones(res.data))
      .catch(err => console.error('Error al obtener publicaciones:', err));
  }, []);

  useEffect(() => {
    console.log('Usuario en Home:', usuario);
  }, [usuario]);

  const handlePublicacionCreada = (nueva) => {
    setPublicaciones([nueva, ...publicaciones]);
    setMostrarFormulario(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      {/* Contenido principal */}
      <main className="p-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Bienvenido, {usuario ? usuario.nombre : 'Invitado'}
        </h2>
        <p className="mb-4">Aquí puedes ver las últimas publicaciones de la comunidad.</p>

        {usuario && mostrarFormulario && (
          <div className="mb-4">
            <CrearPublicacion onPublicacionCreada={handlePublicacionCreada} />
          </div>
        )}

        <div className="mb-4">
          <button
            onClick={() => navigate('/crear-publicacion')}
            className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-green-500 text-white px-4 py-2 text-base font-medium hover:bg-green-600"
          >
           Crea una publicación
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4">Últimas publicaciones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {publicaciones.map(pub => (
            <Link to={`/publicaciones/${pub.id}`} key={pub.id} className="bg-white shadow-md rounded-xl p-4">
              <h3 className="text-lg font-bold">{pub.titulo}</h3>
              <p className="text-gray-600">{pub.contenido.slice(0, 100)}...</p>
              <p className="text-sm text-gray-400 mt-2">Autor: {pub.autorNombre}</p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
