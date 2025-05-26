import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

function Header() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center relative">
      <h1 className="text-2xl font-bold text-purple-600">
        <Link to="/">AmigosJaén</Link>
      </h1>
      {/* Botón hamburguesa para móviles */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menú"
      >
        <span className={`block w-6 h-0.5 bg-purple-600 mb-1 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-purple-600 mb-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-purple-600 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>
      {/* Menú normal en escritorio */}
      <div className="hidden md:flex justify-center items-center space-x-4">
        <button
          onClick={() => navigate('/foro')}
          className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-purple-500 hover:to-purple-700 hover:shadow-lg transition-all duration-300"
        >
          Foro
        </button>
        <button
          onClick={() => navigate('/eventos')}
          className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-purple-500 hover:to-purple-700 hover:shadow-lg transition-all duration-300"
        >
          Eventos
        </button>
        <button
          onClick={() => navigate('/amigos')}
          className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-purple-500 hover:to-purple-700 hover:shadow-lg transition-all duration-300"
        >
          Amigos
        </button>
        <button
          onClick={() => navigate('/about')}
          className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-purple-500 hover:to-purple-700 hover:shadow-lg transition-all duration-300"
        >
          Sobre nosotros
        </button>
      </div>
      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg rounded-b-2xl flex flex-col items-center z-50 md:hidden animate-fade-in">
          <button
            onClick={() => { navigate('/foro'); setMenuOpen(false); }}
            className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-purple-500 hover:to-purple-700 hover:shadow-lg transition-all duration-300 w-11/12 my-1"
          >
            Foro
          </button>
          <button
            onClick={() => { navigate('/eventos'); setMenuOpen(false); }}
            className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-purple-500 hover:to-purple-700 hover:shadow-lg transition-all duration-300 w-11/12 my-1"
          >
            Eventos
          </button>
          <button
            onClick={() => { navigate('/amigos'); setMenuOpen(false); }}
            className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-purple-500 hover:to-purple-700 hover:shadow-lg transition-all duration-300 w-11/12 my-1"
          >
            Amigos
          </button>
          <button
            onClick={() => { navigate('/about'); setMenuOpen(false); }}
            className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-purple-500 hover:to-purple-700 hover:shadow-lg transition-all duration-300 w-11/12 my-1"
          >
            Sobre nosotros
          </button>
          <div className="w-full flex flex-col items-center py-2">
            {!usuario ? (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-purple-500 hover:to-purple-700 hover:shadow-lg transition-all duration-300 w-11/12 my-1 text-center">Iniciar Sesión</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-purple-500 hover:to-purple-700 hover:shadow-lg transition-all duration-300 w-11/12 my-1 text-center">Registrarse</Link>
              </>
            ) : (
              <UserMenu usuario={usuario} />
            )}
          </div>
        </div>
      )}
      {/* Menú usuario en escritorio */}
      <div className="space-x-4 hidden md:flex">
        {!usuario ? (
          <>
            <Link to="/login" className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-purple-500 hover:to-purple-700 hover:shadow-lg transition-all duration-300">Iniciar Sesión</Link>
            <Link to="/register" className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-purple-500 hover:to-purple-700 hover:shadow-lg transition-all duration-300">Registrarse</Link>
          </>
        ) : (
          <UserMenu usuario={usuario} />
        )}
      </div>
    </header>
  );
}

export default Header;
