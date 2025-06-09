import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import AuthContext from "../../context/AuthContext";
// Componente de secciones del perfil de usuario
const PerfilSecciones = ({ usuario, mostrarEventosPorEstado, eventosFinalizadosCreados, cargandoEventosFinalizados }) => {
  // Descripción editable
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const [eventosApuntado, setEventosApuntado] = useState([]);
  const [eventosPasados, setEventosPasados] = useState([]);
  const { usuario: usuarioLogueado } = useContext(AuthContext);

  useEffect(() => {
    if (!usuario) return;
    // Cargar publicaciones del usuario 
    api.get(`/publicaciones?usuarioId=${usuario.id}`)
      .then(res => setPublicaciones(res.data))
      .catch(() => setPublicaciones([]));
    // Cargar eventos a los que está apuntado
    api.get(`/usuarios/${usuario.id}/eventos-apuntado`)
      .then(res => setEventosApuntado(res.data))
      .catch(() => setEventosApuntado([]));
    // Cargar eventos pasados
    api.get(`/usuarios/${usuario.id}/eventos-pasados`)
      .then(res => setEventosPasados(res.data))
      .catch(() => setEventosPasados([]));
    // Cargar descripción si tuviera
    const desc = localStorage.getItem(`desc_${usuario.id}`) || "";
    setDescripcion(desc);
  }, [usuario, usuarioLogueado]);

  const guardarDescripcion = () => {
    localStorage.setItem(`desc_${usuario.id}` , descripcion);
    setEditando(false);
  };

  // Unir eventos apuntados y pasados, eliminando duplicados por id
  const eventosUnicos = [...new Map([...eventosApuntado, ...eventosPasados].map(ev => [ev.id, ev])).values()];

  // Fechas base
  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  const maniana = new Date(hoy);
  maniana.setDate(hoy.getDate() + 1);

  // Filtrar eventos por fecha
  const eventosHoy = eventosUnicos.filter(ev => {
    const fechaEv = new Date(ev.fecha);
    return fechaEv.getFullYear() === hoy.getFullYear() &&
           fechaEv.getMonth() === hoy.getMonth() &&
           fechaEv.getDate() === hoy.getDate();
  });
  const eventosFuturos = eventosUnicos.filter(ev => {
    const fechaEv = new Date(ev.fecha);
    fechaEv.setHours(0,0,0,0);
    return fechaEv.getTime() >= maniana.getTime();
  });
  const eventosPasadosFiltrados = eventosUnicos.filter(ev => {
    const fechaEv = new Date(ev.fecha);
    fechaEv.setHours(0,0,0,0);
    return fechaEv.getTime() < hoy.getTime();
  });
  // Si no se filtra por estado, mostrar solo eventos de hoy o futuros
  const eventosNoPasados = eventosUnicos.filter(ev => {
    const fechaEv = new Date(ev.fecha);
    fechaEv.setHours(0,0,0,0);
    return fechaEv.getTime() >= hoy.getTime();
  });

  return (
    <div className="mt-8 flex flex-col gap-8 px-4 md:px-32 lg:px-64 mb-8">
      {/* Descripción */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold text-purple-700 mb-2">Descripción</h3>
        {editando ? (
          <>
            <textarea
              className="w-full border rounded p-2 mb-2"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              rows={4}
            />
            <button className="bg-green-500 text-white px-4 py-1 rounded mr-2" onClick={guardarDescripcion}>Guardar</button>
            <button className="bg-gray-300 px-4 py-1 rounded" onClick={() => setEditando(false)}>Cancelar</button>
          </>
        ) : (
          <>
            <p className="mb-2 whitespace-pre-line">{descripcion || "Añade una descripción sobre ti..."}</p>
            {usuarioLogueado && usuarioLogueado.id === usuario.id && (
              <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={() => setEditando(true)}>Editar</button>
            )}
          </>
        )}
      </div>
      {/* Publicaciones */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold text-purple-700 mb-2">Publicaciones</h3>
        {publicaciones.length === 0 ? (
          <p className="text-gray-500">No has creado publicaciones.</p>
        ) : (
          <ul className="list-disc pl-5">
            {publicaciones
              .filter(pub => pub.autorNombre === usuario.nombre) // Solo mostrar publicaciones del usuario del perfil
              .map(pub => (
                <li key={pub.id} className="mb-1">
                  <Link
                    to={`/publicaciones/${pub.id}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {pub.titulo}
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </div>
      {/* Eventos finalizados creados */}
      {typeof eventosFinalizadosCreados !== 'undefined' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-purple-700 mb-2">Eventos finalizados creados</h3>
          {cargandoEventosFinalizados ? (
            <div className="text-gray-500">Cargando eventos...</div>
          ) : eventosFinalizadosCreados.length === 0 ? (
            <div className="text-gray-500">No hay eventos finalizados creados por este usuario.</div>
          ) : (
            <ul className="list-disc pl-5">
              {eventosFinalizadosCreados.map(ev => (
                <li key={ev.id} className="mb-3">
                  <div className="font-semibold text-purple-800 text-base">{ev.titulo}</div>
                  <div className="text-gray-600 text-sm mb-1">{ev.descripcion}</div>
                  <div className="text-xs text-gray-500 mb-1">Finalizado el {ev.fecha?.slice(0, 10)}</div>
                  <div className="text-gray-700 font-semibold text-sm">
                    Media valoraciones: {ev.mediaValoracion !== null ? ev.mediaValoracion + ` (${ev.totalValoraciones} valoraciones)` : "Sin valoraciones"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {/* Eventos apuntado */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold text-purple-700 mb-2">Eventos por llegar</h3>
        {mostrarEventosPorEstado ? (
          <>
            {eventosHoy.length > 0 && (
              <div className="mb-2">
                <h4 className="font-semibold text-yellow-700">Hoy</h4>
                <ul className="list-disc pl-5">
                  {eventosHoy.map(ev => (
                    <li key={ev.id} className="mb-1">
                      <Link to={`/eventos/${ev.id}`} className="font-semibold text-blue-600 hover:underline">{ev.titulo}</Link>
                      <span className="text-xs text-gray-400"> ({new Date(ev.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {eventosFuturos.length > 0 && (
              <div>
                <ul className="list-disc pl-5">
                  {eventosFuturos.map(ev => (
                    <li key={ev.id} className="mb-1">
                      <Link to={`/eventos/${ev.id}`} className="font-semibold text-blue-600 hover:underline">{ev.titulo}</Link>
                      <span className="text-xs text-gray-400"> ({new Date(ev.fecha).toLocaleDateString()})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {eventosHoy.length === 0 && eventosFuturos.length === 0 && (
              <p className="text-gray-500">No está inscrito en ningún evento.</p>
            )}
          </>
        ) : (
          eventosNoPasados.length === 0 ? (
            <p className="text-gray-500">No está inscrito en ningún evento.</p>
          ) : (
            <ul className="list-disc pl-5">
              {eventosNoPasados.map(ev => (
                <li key={ev.id} className="mb-1">
                  <Link to={`/eventos/${ev.id}`} className="font-semibold text-blue-600 hover:underline">{ev.titulo}</Link>
                  <span className="text-xs text-gray-400"> ({new Date(ev.fecha).toLocaleDateString()})</span>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
      {/* Eventos pasados */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold text-purple-700 mb-2">Eventos pasados</h3>
        {eventosPasadosFiltrados.length === 0 ? (
          <p className="text-gray-500">No ha asistido a eventos pasados.</p>
        ) : (
          <ul className="list-disc pl-5">
            {eventosPasadosFiltrados.map(ev => (
              <li key={ev.id} className="mb-1">
                <Link
                  to={`/eventos/${ev.id}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {ev.titulo}
                </Link> <span className="text-xs text-gray-400">({new Date(ev.fecha).toLocaleDateString()})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PerfilSecciones;
