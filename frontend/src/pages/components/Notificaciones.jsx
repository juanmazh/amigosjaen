import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import api from "../../api";
import AuthContext from "../../context/AuthContext";

export default function Notificaciones() {
  const { usuario } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const dropdown = useRef(null);
  const trigger = useRef(null);

  // Polling del contador cada 30s
  useEffect(() => {
    if (!usuario) return;
    let cancelado = false;
    const tick = () => {
      api.get("/notificaciones/no-leidas")
        .then((res) => { if (!cancelado) setNoLeidas(res.data.total || 0); })
        .catch(() => {});
    };
    tick();
    const intervalo = setInterval(tick, 30000);
    return () => { cancelado = true; clearInterval(intervalo); };
  }, [usuario]);

  // Cerrar al click fuera
  useEffect(() => {
    const handler = ({ target }) => {
      if (!open) return;
      if (dropdown.current?.contains(target) || trigger.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  const abrir = async () => {
    const nuevoEstado = !open;
    setOpen(nuevoEstado);
    if (nuevoEstado) {
      setCargando(true);
      try {
        const res = await api.get("/notificaciones");
        setItems(res.data || []);
      } finally { setCargando(false); }
    }
  };

  const clickItem = async (n) => {
    if (!n.leida) {
      try {
        await api.patch(`/notificaciones/${n.id}/leer`);
        setNoLeidas((prev) => Math.max(0, prev - 1));
        setItems((prev) => prev.map((x) => x.id === n.id ? { ...x, leida: true } : x));
      } catch {}
    }
    setOpen(false);
    if (n.enlaceUrl) navigate(n.enlaceUrl);
  };

  const marcarTodas = async () => {
    try {
      await api.patch("/notificaciones/leer-todas");
      setNoLeidas(0);
      setItems((prev) => prev.map((x) => ({ ...x, leida: true })));
    } catch {}
  };

  if (!usuario) return null;

  return (
    <div className="relative inline-block">
      <button
        ref={trigger}
        onClick={abrir}
        className="relative w-9 h-9 rounded-full border border-crema-300 hover:border-jaen-300 hover:bg-jaen-50 transition-all flex items-center justify-center text-piedra-700"
        aria-label="Notificaciones"
      >
        <FaBell className="text-sm" />
        {noLeidas > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-ambar-500 text-white text-[10px] font-semibold flex items-center justify-center shadow ring-2 ring-white">
            {noLeidas > 99 ? "99+" : noLeidas}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={dropdown}
          className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-crema-300 shadow-lg overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-crema-200 flex items-center justify-between">
            <p className="font-display text-base text-jaen-700 font-semibold">Notificaciones</p>
            {items.some((n) => !n.leida) && (
              <button onClick={marcarTodas} className="text-xs text-jaen-600 hover:text-jaen-700 font-medium">
                Marcar todas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {cargando ? (
              <p className="p-6 text-sm text-piedra-500 text-center">Cargando…</p>
            ) : items.length === 0 ? (
              <p className="p-6 text-sm text-piedra-500 text-center italic">No tienes notificaciones</p>
            ) : (
              <ul className="divide-y divide-crema-200">
                {items.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => clickItem(n)}
                      className={`w-full text-left px-4 py-3 hover:bg-jaen-50 transition-colors ${
                        !n.leida ? "bg-jaen-50/40" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {!n.leida && <span className="w-2 h-2 rounded-full bg-jaen-500 mt-1.5 shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${!n.leida ? "text-piedra-900 font-medium" : "text-piedra-700"}`}>
                            {n.mensaje}
                          </p>
                          <p className="text-xs text-piedra-500 mt-1">
                            {new Date(n.createdAt).toLocaleString("es-ES", {
                              day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
