import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import Notificaciones from './Notificaciones';
import AuthContext from '../../context/AuthContext';

const navLinks = [
  { to: '/foro', label: 'Foro' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/amigos', label: 'Amigos' },
  { to: '/valoraciones', label: 'Valoraciones' },
  { to: '/about', label: 'Sobre nosotros' },
];

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium tracking-wide transition-colors ${
    isActive
      ? 'text-jaen-600 border-b-2 border-jaen-500 pb-0.5'
      : 'text-piedra-700 hover:text-jaen-600'
  }`;

function Header() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-crema-50/95 backdrop-blur border-b border-crema-300 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl font-semibold text-jaen-600 group-hover:text-jaen-700 transition-colors">
            AmigosJaén
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {usuario?.rol === 'admin' && (
            <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
          )}
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {!usuario ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-jaen-600 hover:text-jaen-700"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-2 rounded-full bg-jaen-500 text-white hover:bg-jaen-600 shadow-sm hover:shadow transition-all"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <Notificaciones />
              <UserMenu usuario={usuario} />
            </>
          )}
        </div>

        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span className={`block w-6 h-0.5 bg-jaen-600 mb-1.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-jaen-600 mb-1.5 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-jaen-600 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-crema-300 bg-crema-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {usuario?.rol === 'admin' && (
              <NavLink
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-md text-piedra-700 hover:bg-jaen-50 hover:text-jaen-600"
              >
                Admin
              </NavLink>
            )}
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-md text-piedra-700 hover:bg-jaen-50 hover:text-jaen-600"
              >
                {l.label}
              </NavLink>
            ))}
            <div className="pt-2 mt-2 border-t border-crema-300">
              {!usuario ? (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-full border border-jaen-500 text-jaen-600 hover:bg-jaen-50"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-full bg-jaen-500 text-white hover:bg-jaen-600"
                  >
                    Registrarse
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Notificaciones />
                  <UserMenu usuario={usuario} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
