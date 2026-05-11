import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AuthContext from "../../context/AuthContext";
import Avatar from "./Avatar";

const MySwal = withReactContent(Swal);

export default function UserMenu({ usuario }) {
  const { logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = ({ target }) => {
      if (!dropdown.current) return;
      if (!open || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  useEffect(() => {
    const handler = ({ keyCode }) => { if (open && keyCode === 27) setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleLogout = async () => {
    const res = await MySwal.fire({
      title: "Cerrar sesión",
      text: "¿Seguro que quieres salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    });
    if (res.isConfirmed) { logout(); navigate("/login"); }
  };

  if (!usuario) return null;

  return (
    <div className="relative inline-block">
      <button
        ref={trigger}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-crema-300 hover:border-jaen-300 hover:bg-jaen-50 transition-all"
      >
        <Avatar nombre={usuario.nombre} url={usuario.avatarUrl} size={32} />
        <span className="text-sm font-medium text-piedra-700">{usuario.nombre || "Cuenta"}</span>
        <FaChevronDown className={`text-xs text-piedra-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          ref={dropdown}
          className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-crema-300 shadow-lg overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-crema-200">
            <p className="text-sm font-medium text-piedra-900">{usuario.nombre}</p>
            <p className="text-xs text-piedra-500 truncate">{usuario.email}</p>
          </div>
          <button
            onClick={() => { setOpen(false); navigate('/perfil'); }}
            className="w-full text-left px-4 py-2.5 text-sm text-piedra-700 hover:bg-jaen-50 hover:text-jaen-600 transition-colors"
          >
            Mi perfil
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
