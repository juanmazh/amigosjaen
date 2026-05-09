import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import CrearPublicacion from "./components/CrearPublicacion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EventosHome from "./components/EventosHome";

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

  const handlePublicacionCreada = (nueva) => {
    setPublicaciones([nueva, ...publicaciones]);
    setMostrarFormulario(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-crema-100">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-crema-300">
        <div className="absolute inset-0 bg-gradient-to-br from-jaen-50 via-crema-100 to-olivo-100/40" />
        <div className="absolute -right-16 -top-16 w-96 h-96 rounded-full bg-jaen-200/40 blur-3xl" />
        <div className="absolute -left-20 bottom-0 w-80 h-80 rounded-full bg-ambar-300/30 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-jaen-500 font-semibold mb-4">
            La comunidad de Jaén
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold text-jaen-700 leading-tight">
            Conecta. Comparte. <span className="text-olivo-700">Descubre.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-piedra-500">
            Una plaza digital para vecinos de Jaén: comparte planes, asiste a
            eventos locales y haz amigos en tu tierra.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            {!usuario ? (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-full bg-jaen-500 text-white font-medium hover:bg-jaen-600 shadow-md hover:shadow-lg transition-all"
                >
                  Únete ahora
                </Link>
                <Link
                  to="/eventos"
                  className="px-6 py-3 rounded-full border border-jaen-500 text-jaen-600 font-medium hover:bg-jaen-50 transition-colors"
                >
                  Ver eventos
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/crear-publicacion')}
                  className="px-6 py-3 rounded-full bg-jaen-500 text-white font-medium hover:bg-jaen-600 shadow-md hover:shadow-lg transition-all"
                >
                  Crear publicación
                </button>
                <Link
                  to="/eventos"
                  className="px-6 py-3 rounded-full border border-jaen-500 text-jaen-600 font-medium hover:bg-jaen-50 transition-colors"
                >
                  Ver eventos
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
        {usuario && (
          <p className="text-piedra-500 mb-8">
            Bienvenido de vuelta, <span className="text-jaen-600 font-medium">{usuario.nombre}</span>.
          </p>
        )}

        {usuario && mostrarFormulario && (
          <div className="mb-10">
            <CrearPublicacion onPublicacionCreada={handlePublicacionCreada} />
          </div>
        )}

        {/* Eventos */}
        <div className="mb-14">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-3xl text-jaen-700 font-semibold">
              Próximos eventos
            </h2>
            <Link to="/eventos" className="text-sm text-jaen-600 hover:text-jaen-700 font-medium">
              Ver todos →
            </Link>
          </div>
          <EventosHome />
        </div>

        {/* Publicaciones */}
        <div>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-3xl text-jaen-700 font-semibold">
              Últimas publicaciones
            </h2>
            <Link to="/foro" className="text-sm text-jaen-600 hover:text-jaen-700 font-medium">
              Ir al foro →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {publicaciones.map(pub => (
              <Link
                to={`/publicaciones/${pub.id}`}
                key={pub.id}
                className="group bg-white border border-crema-300 rounded-2xl p-6 hover:border-jaen-300 hover:shadow-md transition-all"
              >
                <h3 className="font-display text-xl font-semibold text-piedra-900 group-hover:text-jaen-600 transition-colors mb-2">
                  {pub.titulo}
                </h3>
                <p className="text-piedra-500 text-sm leading-relaxed">
                  {pub.contenido.slice(0, 120)}{pub.contenido.length > 120 ? '…' : ''}
                </p>
                <p className="text-xs text-piedra-500/70 mt-4 pt-4 border-t border-crema-200">
                  por <span className="text-jaen-600 font-medium">{pub.autorNombre}</span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
