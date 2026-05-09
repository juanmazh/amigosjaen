import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import CrearPublicacion from "./components/CrearPublicacion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthContext from '../context/AuthContext';

function CrearPublicacionPage() {
  const navigate = useNavigate();
  const { usuario, cargando } = useContext(AuthContext);

  useEffect(() => {
    if (!cargando && !usuario) navigate('/login');
  }, [usuario, cargando, navigate]);

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col bg-crema-100">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-piedra-500">Cargando…</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-crema-100">
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <div className="mb-8">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-jaen-500 font-semibold mb-2">
            Nueva conversación
          </span>
          <h1 className="font-display text-4xl text-jaen-700 font-semibold">Crear publicación</h1>
        </div>
        <CrearPublicacion onPublicacionCreada={() => navigate('/')} />
      </main>
      <Footer />
    </div>
  );
}

export default CrearPublicacionPage;
