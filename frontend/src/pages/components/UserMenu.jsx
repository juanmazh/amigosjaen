// src/components/UserMenu.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AuthContext from "../../context/AuthContext";
// Componente de menú de usuario del header
const MySwal = withReactContent(Swal);

export default function UserMenu({ usuario }) {
  const { logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    const res = await MySwal.fire({
      title: "Cerrar sesión",
      text: "¿Estás seguro de que deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    });

    if (res.isConfirmed) {
      logout();
      navigate("/");
    }
  };

  if (!usuario) return null;

  return (
    <div className="relative inline-block">
      <button
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 text-base font-medium shadow-md hover:from-purple-500 hover:to-purple-700 hover:shadow-lg transition-all duration-300"
      >
        {usuario.nombre || "Cuenta"}
        <span
          className={`transform duration-100 ${dropdownOpen ? "-rotate-180" : "rotate-0"}`}
        >
          ▼
        </span>
      </button>

      {dropdownOpen && (
        <div
          ref={dropdown}
          className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200"
        >
          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-gray-800">
              {usuario.nombre || "Usuario"}
            </p>
            <p className="text-sm text-gray-600">
              {usuario.email || "email@ejemplo.com"}
            </p>
          </div>
          <div className="border-t border-gray-200"></div>
          <button
            onClick={() => { setDropdownOpen(false); navigate('/perfil'); }}
            className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-100/70 hover:text-purple-800 rounded-lg transition-all duration-200"
          >
            Mi perfil
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100/70 hover:text-red-700 rounded-lg transition-all duration-200"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
