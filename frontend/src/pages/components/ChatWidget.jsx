import React, { useState, useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import { FaComments, FaArrowLeft, FaUserPlus, FaListUl, FaComment } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import '../../assets/styles/ChatWidget.css';
//const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://localhost:5000';  Cambia esto a tu URL de socket.io en producción
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://amigosjaen.onrender.com';

const ChatWidget = () => {
  const { usuario } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('conversaciones');
  const [conversaciones, setConversaciones] = useState([]);
  const [seguidores, setSeguidores] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const socketRef = useRef(null);
  const mensajesEndRef = useRef(null);

  // Conexión socket
  useEffect(() => {
    if (usuario) {
      socketRef.current = io(SOCKET_URL, { withCredentials: true });
      socketRef.current.emit('registrarUsuario', usuario.id);
      return () => socketRef.current.disconnect();
    }
  }, [usuario]);

  // Efecto para recibir mensajes en tiempo real
  useEffect(() => {
    if (!socketRef.current) return;
    // Recibe mensajes en tiempo real
    socketRef.current.on('nuevoMensaje', (mensaje) => {
      // Mostrar el mensaje si es para este chat abierto
      if (
        (mensaje.remitenteId === usuarioActivo?.id && mensaje.destinatarioId === usuario.id) ||
        (mensaje.remitenteId === usuario.id && mensaje.destinatarioId === usuarioActivo?.id)
      ) {
        setMensajes((prev) => {
          // Evita duplicados si ya está el mensaje temporal
          if (mensaje.id && prev.some(m => m.id === mensaje.id)) return prev;
          // Si es un mensaje propio, elimina el temporal
          if (mensaje.remitenteId === usuario.id) {
            return [...prev.filter(m => !(typeof m.id === 'string' && m.id.startsWith('temp-') && m.contenido === mensaje.contenido)), mensaje];
          }
          return [...prev, mensaje];
        });
      }
    });
    return () => {
      socketRef.current.off('nuevoMensaje');
    };
  }, [usuarioActivo, usuario]);

  // Actualiza la lista de conversaciones en tiempo real al recibir un nuevo mensaje
  useEffect(() => {
    if (!socketRef.current) return;
    const actualizarConversaciones = (mensaje) => {
      setConversaciones(prev => {
        // Determina el otro usuario
        const otroId = mensaje.remitenteId === usuario.id ? mensaje.destinatarioId : mensaje.remitenteId;
        // Si el chat NO está abierto con ese usuario y el mensaje es para mí, marcar como no leído
        let mensajeActualizado = { ...mensaje };
        if (
          mensaje.destinatarioId === usuario.id &&
          (!usuarioActivo || usuarioActivo.id !== otroId)
        ) {
          mensajeActualizado.leido = false;
        }
        // Si ya existe la conversación, actualiza el último mensaje y la sube arriba
        const existe = prev.find(conv => conv.usuario.id === otroId);
        if (existe) {
          return [
            {
              ...existe,
              ultimoMensaje: mensajeActualizado,
            },
            ...prev.filter(conv => conv.usuario.id !== otroId)
          ];
        } else {
          // Si no existe, añade la conversación (solo si el usuario está en seguidores)
          const usuarioConv = seguidores.find(s => s.id === otroId) || { id: otroId, nombre: `Usuario ${otroId}` };
          return [
            {
              usuario: usuarioConv,
              ultimoMensaje: mensajeActualizado,
              mensajes: [mensajeActualizado],
            },
            ...prev
          ];
        }
      });
    };
    socketRef.current.on('nuevoMensaje', actualizarConversaciones);
    return () => {
      socketRef.current.off('nuevoMensaje', actualizarConversaciones);
    };
  }, [usuario, seguidores, usuarioActivo]);

  // Cargar conversaciones recientes
  useEffect(() => {
    if (usuario) {
      const token = localStorage.getItem('token');
      fetch(`https://amigosjaen.onrender.com/api/mensajes/conversaciones/${usuario.id}`, {
        credentials: 'include',
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
        }
      })
        .then(res => res.json())
        .then(data => {
          if (!Array.isArray(data) || data.length === 0) {
            setConversaciones([]);
            return;
          }
          // El backend ya devuelve [{ usuario, mensaje }]
          const listaConversaciones = data.map(conv => ({
            usuario: conv.usuario,
            ultimoMensaje: conv.mensaje,
            mensajes: [conv.mensaje],
          }));
          setConversaciones(listaConversaciones);
        })
        .catch(() => setConversaciones([]));
    }
  }, [usuario, seguidores]);

  // Cargar usuarios seguidos
  useEffect(() => {
    if (usuario) {
      fetch(`https://amigosjaen.onrender.com/api/usuarios/${usuario.id}/seguidos`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setSeguidores(data))
        .catch(err => {
          console.error('Error al cargar seguidos:', err);
        });
    }
  }, [usuario]);

  // Cargar historial de mensajes y mover a conversaciones
  const abrirChat = (otroUsuario) => {
    setUsuarioActivo(otroUsuario);
    setTab('conversaciones');
    const token = localStorage.getItem('token');
    fetch(`https://amigosjaen.onrender.com/api/mensajes/${otroUsuario.id}`, {
      credentials: 'include',
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined,
      }
    })
      .then(res => res.json())
      .then(data => {
        setMensajes(Array.isArray(data) ? data : []);
        setConversaciones(prev => {
          let actualizado = prev;
          // Marcar como leídos los mensajes de este usuario en el estado local
          actualizado = actualizado.map(conv => {
            if (conv.usuario.id === otroUsuario.id && conv.ultimoMensaje && conv.ultimoMensaje.remitenteId !== usuario.id) {
              return {
                ...conv,
                ultimoMensaje: { ...conv.ultimoMensaje, leido: true },
              };
            }
            return conv;
          });
          // Si no existe la conversación, la añade
          if (!actualizado.some(conv => conv.usuario.id === otroUsuario.id)) {
            actualizado = [...actualizado, { usuario: otroUsuario }];
          }
          return actualizado;
        });
        // Llama al backend para marcar como leídos
        fetch(`https://amigosjaen.onrender.com/api/mensajes/leido`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({ remitenteId: otroUsuario.id }),
        });
      })
      .catch(err => {
        setMensajes([]);
        console.error('Error al cargar mensajes:', err);
      });
  };

  // Enviar mensaje
  const enviarMensaje = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !usuarioActivo) return;
    const mensajeData = {
      remitenteId: usuario.id,
      destinatarioId: usuarioActivo.id,
      contenido: nuevoMensaje,
    };
    socketRef.current.emit('mensajeDirecto', mensajeData);
    // Mostrar el mensaje propio inmediatamente en el historial
    setMensajes(prev => [
      ...prev,
      {
        id: `temp-${Date.now()}`, // id temporal
        remitenteId: usuario.id,
        destinatarioId: usuarioActivo.id,
        contenido: nuevoMensaje,
        createdAt: new Date().toISOString(),
      }
    ]);
    setNuevoMensaje('');
  };

  // Scroll automático al final del historial de mensajes
  useEffect(() => {
    if (mensajesEndRef.current) {
      mensajesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes, usuarioActivo, open]);

  // Cerrar chat al hacer click fuera del modal, excepto si el click es en el botón flotante
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      const modal = document.querySelector('.chat-modal-pro');
      const toggleBtn = document.querySelector('.chat-toggle-btn');
      if (
        modal && !modal.contains(e.target) &&
        toggleBtn && !toggleBtn.contains(e.target)
      ) {
        setOpen(false);
        setUsuarioActivo(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Permitir cerrar el chat haciendo click de nuevo en el boton flotante
  const handleToggleChat = (e) => {
    // Si el chat est abierto y el click viene del boton, solo cerrar
    if (open) {
      setOpen(false);
      setUsuarioActivo(null);
      // Evitar que el click burbujee (No se si se llama asi) y vuelva a abrir el chat
      if (e) e.stopPropagation();
      return;
    }
    setOpen(true);
  };

  // Calcular número de conversaciones con mensajes no leídos
  const unreadCount = conversaciones.reduce((acc, conv) => {
    if (
      conv.ultimoMensaje &&
      conv.ultimoMensaje.remitenteId !== usuario.id &&
      !conv.ultimoMensaje.leido
    ) {
      return acc + 1;
    }
    return acc;
  }, 0);

  // Verificar si el usuario está autenticado para enseñar el chat
  if (!usuario) return null;

  // Cambia el wrapper principal para posicionar el chat siempre sobre el footer
  return (
    <div className="chat-widget-fixed" style={{ pointerEvents: 'none' }}>
      <button
        className="chat-toggle-btn"
        onClick={handleToggleChat}
        type="button"
        style={{ pointerEvents: 'auto' }}
      >
        <FaComments size={28} />
        {unreadCount > 0 && (
          <span className="chat-icon-badge-pro">{unreadCount}</span>
        )}
      </button>
      {open && (
        <div className="chat-modal chat-modal-pro" style={{ pointerEvents: 'auto' }}>
          {/* Eliminada la X de cerrar */}
          <div className="chat-tabs chat-tabs-pro">
            <button onClick={() => setTab('conversaciones')} className={tab === 'conversaciones' ? 'active' : ''} title="Conversaciones">
              <FaListUl />
              {unreadCount > 0 && (
                <span className="chat-tab-badge-pro">{unreadCount}</span>
              )}
            </button>
            <button onClick={() => setTab('nueva')} className={tab === 'nueva' ? 'active' : ''} title="Nuevo chat">
              <FaUserPlus />
            </button>
          </div>
          <div className="chat-content chat-content-pro">
            {usuarioActivo ? (
              <div className="chat-messages chat-messages-pro chat-messages-full">
                <div className="chat-messages-header-pro">
                  <div className="chat-avatar-pro chat-avatar-lg-pro">{usuarioActivo.nombre?.[0]?.toUpperCase() || 'U'}</div>
                  <h4 className="chat-messages-titulo-pro">
                    <a
                      href={`/perfil/${usuarioActivo.id}`}
                      className="chat-nombre-link-pro"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Ver perfil de ${usuarioActivo.nombre}`}
                    >
                      Chat con {usuarioActivo.nombre}
                    </a>
                  </h4>
                  <button className="chat-back-btn-pro" onClick={() => setUsuarioActivo(null)} title="Volver a conversaciones">
                    <FaArrowLeft />
                  </button>
                </div>
                <div className="mensajes-historial mensajes-historial-pro" style={{ maxHeight: 'calc(60vh - 120px)', overflowY: 'auto' }}>
                  {mensajes.map(msg => (
                    <div key={msg.id} className={msg.remitenteId === usuario.id ? 'msg-propio-pro' : 'msg-ajeno-pro'}>
                      <span>{msg.contenido}</span>
                    </div>
                  ))}
                  <div ref={mensajesEndRef} />
                </div>
                <form onSubmit={enviarMensaje} className="chat-form chat-form-pro">
                  <input
                    type="text"
                    value={nuevoMensaje}
                    onChange={e => setNuevoMensaje(e.target.value)}
                    placeholder="Escribe un mensaje..."
                  />
                  <button type="submit" title="Enviar mensaje">
                    <FaComment />
                  </button>
                </form>
              </div>
            ) : (
              <>
                {tab === 'conversaciones' && (
                  <ul className="chat-list chat-list-pro">
                    {conversaciones.length === 0 ? (
                      <li className="chat-list-empty">No tienes conversaciones recientes.</li>
                    ) : (
                      conversaciones.map(conv => (
                        <li key={conv.usuario.id}
                            onClick={() => abrirChat(conv.usuario)}
                            className={`chat-list-item-pro ${usuarioActivo?.id === conv.usuario.id ? 'active' : ''}`}
                        >
                          <div className="chat-avatar-pro">{conv.usuario?.nombre?.[0]?.toUpperCase() || 'U'}</div>
                          <div className="chat-list-info-pro">
                            <span className="chat-list-nombre-pro">{conv.usuario?.nombre || 'Usuario'}
                              {conv.ultimoMensaje && conv.ultimoMensaje.remitenteId !== usuario.id && (!usuarioActivo || usuarioActivo.id !== conv.usuario.id) && !conv.ultimoMensaje.leido && (
                                <span className="chat-badge-pro" title="Nuevo mensaje" />
                              )}
                            </span>
                            {conv.ultimoMensaje && (
                              <span className="ultimo-mensaje chat-list-ultimo-pro">{conv.ultimoMensaje.contenido}</span>
                            )}
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                )}
                {tab === 'nueva' && (
                  <ul className="chat-list chat-list-pro">
                    {seguidores.filter(seg => !conversaciones.some(conv => conv.usuario.id === seg.id)).length === 0 ? (
                      <li className="chat-list-empty">No hay usuarios nuevos para chatear.</li>
                    ) : (
                      seguidores
                        .filter(seg => !conversaciones.some(conv => conv.usuario.id === seg.id))
                        .map(seg => (
                          <li key={seg.id} onClick={() => abrirChat(seg)} className="chat-list-item-pro">
                            <div className="chat-avatar-pro">{seg.nombre?.[0]?.toUpperCase() || 'U'}</div>
                            <div className="chat-list-info-pro">
                              <span className="chat-list-nombre-pro">{seg.nombre}</span>
                            </div>
                          </li>
                        ))
                    )}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
