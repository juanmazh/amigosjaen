import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

function Header() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-purple-600">
        <Link to="/">AmigosJaén</Link>
      </h1>
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={() => navigate('/foro')}
          className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-indigo-400 to-indigo-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-indigo-500 hover:to-indigo-700 hover:shadow-lg transition-all duration-300"
        >
          Foro
        </button>
      </div>
      <div className="space-x-4">
        {!usuario ? (
          <>
            <Link to="/login" className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-blue-500 hover:to-blue-700 hover:shadow-lg transition-all duration-300">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-green-500 hover:to-green-700 hover:shadow-lg transition-all duration-300">
              Registrarse
            </Link>
          </>
        ) : (
          <UserMenu usuario={usuario} />
        )}
      </div>
    </header>
  );
}

export default Header;
