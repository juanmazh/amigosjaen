// src/pages/Home.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';

function Home() {
  const [publicaciones, setPublicaciones] = useState([]);
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/publicaciones')
      .then(res => setPublicaciones(res.data))
      .catch(err => console.error('Error al obtener publicaciones:', err));
  }, []);

  return (
      <div className="min-h-screen flex flex-col justify-between">  
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">   
      <h1 className="text-2xl font-bold text-purple-600">AmigosJaén</h1>
      <div className="space-x-4">
          {!usuario ? (
            <>
              <Link to="/login" className="text-sky-500 hover:underline">Iniciar Sesión</Link>
              <Link to="/register" className="text-sky-500 hover:underline">Registrarse</Link>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="p-4 max-w-4xl mx-auto">       
         <h2 className="text-xl font-semibold mb-4">Últimas publicaciones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {publicaciones.map(pub => (
            <div key={pub.id} className="bg-white shadow-md rounded-xl p-4">
              <h3 className="text-lg font-bold">{pub.titulo}</h3>
              <p className="text-gray-600">{pub.contenido.slice(0, 100)}...</p>
            </div>
          ))}
        </div>
      </main>

        {/* Footer */}
    <footer className="bg-white shadow p-4 text-center text-sm text-gray-500">
      © 2025 Mi Foro. Todos los derechos reservados.
    </footer>
  </div>
  );
}

export default Home;
