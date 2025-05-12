import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import UserMenu from './components/UserMenu';

function PublicacionDetalle() {
  const { id } = useParams();
  const [publicacion, setPublicacion] = useState(null);
  const { usuario } = useContext(AuthContext);

  useEffect(() => {
    api.get(`/publicaciones/${id}`)
      .then(res => setPublicacion(res.data))
      .catch(err => console.error('Error al obtener la publicación:', err));
  }, [id]);

  if (!publicacion) {
    return <p>Cargando publicación...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-600">
          <Link to="/">AmigosJaén</Link>
        </h1>
        <div className="space-x-4">
          {!usuario ? (
            <>
              <Link to="/login" className="text-sky-500 hover:underline">Iniciar Sesión</Link>
              <Link to="/register" className="text-sky-500 hover:underline">Registrarse</Link>
            </>
          ) : (
            <UserMenu usuario={usuario} />
          )}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="p-4 max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-3xl font-bold mb-4">{publicacion.titulo}</h2>
          <p className="text-gray-600 mb-4">{publicacion.contenido}</p>
          <p className="text-sm text-gray-400">Autor: {publicacion.autorNombre}</p>
          {publicacion.tags && publicacion.tags.length > 0 && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Etiquetas:</h4>
              <div className="flex flex-wrap gap-2">
                {publicacion.tags.map((tag, index) => (
                  <span key={index} className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-sm">
                    {tag.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 shadow-inner rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Comentarios</h3>
          <p className="text-gray-500">Aún no hay comentarios. ¡Sé el primero en comentar!</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow p-4 text-center text-sm text-gray-500">
        © 2025 AmigosJaén. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default PublicacionDetalle;