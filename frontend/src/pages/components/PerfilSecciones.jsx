import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import AuthContext from "../../context/AuthContext";

const Section = ({ title, children }) => (
  <div className="bg-white border border-crema-300 rounded-2xl p-6">
    <h3 className="font-display text-xl text-jaen-700 font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const EventoItem = ({ ev, hora }) => (
  <li className="py-2 border-b border-crema-200 last:border-0">
    <Link to={`/eventos/${ev.id}`} className="flex items-baseline justify-between gap-3 hover:text-jaen-600 transition-colors group">
      <span className="font-medium text-piedra-700 group-hover:text-jaen-600">{ev.titulo}</span>
      <span className="text-xs text-piedra-500 shrink-0">
        {hora
          ? new Date(ev.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
          : new Date(ev.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
      </span>
    </Link>
  </li>
);

const PerfilSecciones = ({ usuario, mostrarEventosPorEstado, eventosFinalizadosCreados, cargandoEventosFinalizados }) => {
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const [eventosApuntado, setEventosApuntado] = useState([]);
  const [eventosPasados, setEventosPasados] = useState([]);
  const { usuario: usuarioLogueado } = useContext(AuthContext);

  useEffect(() => {
    if (!usuario) return;
    api.get(`/publicaciones?usuarioId=${usuario.id}`).then(res => setPublicaciones(res.data)).catch(() => setPublicaciones([]));
    api.get(`/usuarios/${usuario.id}/eventos-apuntado`).then(res => setEventosApuntado(res.data)).catch(() => setEventosApuntado([]));
    api.get(`/usuarios/${usuario.id}/eventos-pasados`).then(res => setEventosPasados(res.data)).catch(() => setEventosPasados([]));
    setDescripcion(localStorage.getItem(`desc_${usuario.id}`) || "");
  }, [usuario, usuarioLogueado]);

  const guardarDescripcion = () => {
    localStorage.setItem(`desc_${usuario.id}`, descripcion);
    setEditando(false);
  };

  const eventosUnicos = [...new Map([...eventosApuntado, ...eventosPasados].map(ev => [ev.id, ev])).values()];
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const maniana = new Date(hoy); maniana.setDate(hoy.getDate() + 1);

  const eventosHoy = eventosUnicos.filter(ev => {
    const f = new Date(ev.fecha);
    return f.getFullYear() === hoy.getFullYear() && f.getMonth() === hoy.getMonth() && f.getDate() === hoy.getDate();
  });
  const eventosFuturos = eventosUnicos.filter(ev => {
    const f = new Date(ev.fecha); f.setHours(0, 0, 0, 0);
    return f.getTime() >= maniana.getTime();
  });
  const eventosPasadosFiltrados = eventosUnicos.filter(ev => {
    const f = new Date(ev.fecha); f.setHours(0, 0, 0, 0);
    return f.getTime() < hoy.getTime();
  });
  const eventosNoPasados = eventosUnicos.filter(ev => {
    const f = new Date(ev.fecha); f.setHours(0, 0, 0, 0);
    return f.getTime() >= hoy.getTime();
  });

  const esPropio = usuarioLogueado && usuarioLogueado.id === usuario.id;
  const pubsUsuario = publicaciones.filter(pub => pub.autorNombre === usuario.nombre);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      <Section title="Sobre mí">
        {editando ? (
          <>
            <textarea
              className="w-full px-4 py-2.5 rounded-lg border border-crema-300 bg-crema-50 focus:bg-white focus:border-jaen-400 focus:ring-2 focus:ring-jaen-200 outline-none transition-all mb-3"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              rows={4}
              placeholder="Cuenta algo sobre ti…"
            />
            <div className="flex gap-2">
              <button className="px-5 py-2 rounded-full bg-jaen-500 text-white text-sm font-medium hover:bg-jaen-600 transition-colors" onClick={guardarDescripcion}>Guardar</button>
              <button className="px-5 py-2 rounded-full border border-crema-300 text-piedra-700 text-sm hover:bg-crema-50 transition-colors" onClick={() => setEditando(false)}>Cancelar</button>
            </div>
          </>
        ) : (
          <>
            <p className="text-piedra-700 whitespace-pre-line leading-relaxed mb-3">
              {descripcion || <span className="text-piedra-500 italic">Aún no hay descripción.</span>}
            </p>
            {esPropio && (
              <button className="text-sm text-jaen-600 hover:text-jaen-700 font-medium" onClick={() => setEditando(true)}>
                Editar descripción
              </button>
            )}
          </>
        )}
      </Section>

      <Section title="Publicaciones">
        {pubsUsuario.length === 0 ? (
          <p className="text-piedra-500 text-sm italic">Sin publicaciones aún.</p>
        ) : (
          <ul className="divide-y divide-crema-200">
            {pubsUsuario.map(pub => (
              <li key={pub.id} className="py-2.5">
                <Link to={`/publicaciones/${pub.id}`} className="text-piedra-700 hover:text-jaen-600 font-medium transition-colors">
                  {pub.titulo}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {typeof eventosFinalizadosCreados !== 'undefined' && (
        <Section title="Eventos finalizados creados">
          {cargandoEventosFinalizados ? (
            <p className="text-piedra-500 text-sm">Cargando…</p>
          ) : eventosFinalizadosCreados.length === 0 ? (
            <p className="text-piedra-500 text-sm italic">No hay eventos finalizados.</p>
          ) : (
            <ul className="space-y-4">
              {eventosFinalizadosCreados.map(ev => (
                <li key={ev.id} className="pb-4 border-b border-crema-200 last:border-0 last:pb-0">
                  <p className="font-display text-lg text-piedra-900 font-semibold">{ev.titulo}</p>
                  <p className="text-sm text-piedra-500 mt-1">{ev.descripcion}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                    <span className="text-piedra-500">Finalizado el {ev.fecha?.slice(0, 10)}</span>
                    <span className="px-2 py-0.5 rounded-full bg-ambar-300/30 text-ambar-700 font-medium">
                      {ev.mediaValoracion !== null ? `${ev.mediaValoracion} ★ (${ev.totalValoraciones})` : "Sin valoraciones"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      <Section title="Próximos eventos">
        {mostrarEventosPorEstado ? (
          <>
            {eventosHoy.length > 0 && (
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-ambar-700 font-semibold mb-2">Hoy</p>
                <ul className="space-y-1">
                  {eventosHoy.map(ev => <EventoItem key={ev.id} ev={ev} hora />)}
                </ul>
              </div>
            )}
            {eventosFuturos.length > 0 && (
              <div>
                {eventosHoy.length > 0 && <p className="text-xs uppercase tracking-wider text-jaen-500 font-semibold mb-2">Próximamente</p>}
                <ul className="space-y-1">
                  {eventosFuturos.map(ev => <EventoItem key={ev.id} ev={ev} />)}
                </ul>
              </div>
            )}
            {eventosHoy.length === 0 && eventosFuturos.length === 0 && (
              <p className="text-piedra-500 text-sm italic">Sin inscripciones activas.</p>
            )}
          </>
        ) : eventosNoPasados.length === 0 ? (
          <p className="text-piedra-500 text-sm italic">Sin inscripciones activas.</p>
        ) : (
          <ul className="space-y-1">
            {eventosNoPasados.map(ev => <EventoItem key={ev.id} ev={ev} />)}
          </ul>
        )}
      </Section>

      <Section title="Eventos pasados">
        {eventosPasadosFiltrados.length === 0 ? (
          <p className="text-piedra-500 text-sm italic">No ha asistido a eventos pasados.</p>
        ) : (
          <ul className="space-y-1">
            {eventosPasadosFiltrados.map(ev => <EventoItem key={ev.id} ev={ev} />)}
          </ul>
        )}
      </Section>
    </div>
  );
};

export default PerfilSecciones;
