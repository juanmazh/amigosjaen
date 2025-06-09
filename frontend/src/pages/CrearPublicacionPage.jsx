import { useNavigate } from 'react-router-dom';
import CrearPublicacion from "./components/CrearPublicacion";
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import Footer from "./components/Footer";
// Componente de página para crear una nueva publicación
function CrearPublicacionPage() {
  const navigate = useNavigate();
  const [publicacionCreada, setPublicacionCreada] = useState(false);
  const { usuario, cargando } = useContext(AuthContext);

  useEffect(() => {
    if (!cargando && !usuario) {
      navigate('/login'); // Redirige a la página de inicio de sesión si no está autenticado
    }
  }, [usuario, cargando, navigate]);

  const handlePublicacionCreada = (nueva) => {
    setPublicacionCreada(true);
    navigate('/'); // Redirige al Home después de crear la publicación
  };

  if (cargando) {
    return <p>Cargando...</p>; // Muestra un mensaje de carga mientras se verifica la autenticación
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 to-purple-200">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-600">
          Crear Publicación
        </h1>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gray-500 text-white px-4 py-2 text-base font-medium hover:bg-gray-600"
        >
          Volver
        </button>
      </header>

      <main className="p-4 max-w-4xl mx-auto flex-1">
        <h2 className="text-xl font-semibold mb-4">Nueva Publicación</h2>
        <CrearPublicacion onPublicacionCreada={handlePublicacionCreada} />
      </main>

      <Footer />
    </div>
  );
}

export default CrearPublicacionPage;
