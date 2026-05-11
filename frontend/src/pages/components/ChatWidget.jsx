import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaComments, FaArrowLeft, FaUserPlus, FaListUl, FaComment } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import api from '../../api';
import '../../assets/styles/ChatWidget.css';

const ChatWidget = () => {
  const { usuario } = useContext(AuthContext);
  const socket = useSocket();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('conversaciones');
  const [conversaciones, setConversaciones] = useState([]);
  const [seguidores, setSeguidores] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const mensajesEndRef = useRef(null);

  useEffect(() => {
    if (!socket || !usuario) return;
    const handler = (mensaje) => {
      if (
        (mensaje.remitenteId === usuarioActivo?.id && mensaje.destinatarioId === usuario.id) ||
        (mensaje.remitenteId === usuario.id && mensaje.destinatarioId === usuarioActivo?.id)
      ) {
        setMensajes((prev) => {
          if (mensaje.id && prev.some(m => m.id === mensaje.id)) return prev;
          if (mensaje.remitenteId === usuario.id) {
            return [...prev.filter(m => !(typeof m.id === 'string' && m.id.startsWith('temp-') && m.contenido === mensaje.contenido)), mensaje];
          }
          return [...prev, mensaje];
        });
      }
    };
    socket.on('nuevoMensaje', handler);
    return () => { socket.off('nuevoMensaje', handler); };
  }, [socket, usuarioActivo, usuario]);

  useEffect(() => {
    if (!socket || !usuario) return;
    const actualizarConversaciones = (mensaje) => {
      setConversaciones(prev => {
        const otroId = mensaje.remitenteId === usuario.id ? mensaje.destinatarioId : mensaje.remitenteId;
        let mensajeActualizado = { ...mensaje };
        if (mensaje.destinatarioId === usuario.id && (!usuarioActivo || usuarioActivo.id !== otroId)) {
          mensajeActualizado.leido = false;
        }
        const existe = prev.find(conv => conv.usuario.id === otroId);
        if (existe) {
          return [{ ...existe, ultimoMensaje: mensajeActualizado }, ...prev.filter(conv => conv.usuario.id !== otroId)];
        }
        const usuarioConv = seguidores.find(s => s.id === otroId) || { id: otroId, nombre: `Usuario ${otroId}` };
        return [{ usuario: usuarioConv, ultimoMensaje: mensajeActualizado, mensajes: [mensajeActualizado] }, ...prev];
      });
    };
    socket.on('nuevoMensaje', actualizarConversaciones);
    return () => { socket.off('nuevoMensaje', actualizarConversaciones); };
  }, [socket, usuario, seguidores, usuarioActivo]);

  useEffect(() => {
    if (!usuario) return;
    api.get(`/mensajes/conversaciones/${usuario.id}`)
      .then(res => {
        const data = res.data;
        if (!Array.isArray(data) || data.length === 0) { setConversaciones([]); return; }
        setConversaciones(data.map(conv => ({ usuario: conv.usuario, ultimoMensaje: conv.mensaje, mensajes: [conv.mensaje] })));
      })
      .catch(() => setConversaciones([]));
  }, [usuario, seguidores]);

  useEffect(() => {
    if (!usuario) return;
    api.get(`/usuarios/${usuario.id}/seguidos`)
      .then(res => setSeguidores(res.data))
      .catch(() => {});
  }, [usuario]);

  const abrirChat = (otroUsuario) => {
    setUsuarioActivo(otroUsuario);
    setTab('conversaciones');
    api.get(`/mensajes/${otroUsuario.id}`)
      .then(res => {
        setMensajes(Array.isArray(res.data) ? res.data : []);
        setConversaciones(prev => {
          let actualizado = prev.map(conv => {
            if (conv.usuario.id === otroUsuario.id && conv.ultimoMensaje && conv.ultimoMensaje.remitenteId !== usuario.id) {
              return { ...conv, ultimoMensaje: { ...conv.ultimoMensaje, leido: true } };
            }
            return conv;
          });
          if (!actualizado.some(conv => conv.usuario.id === otroUsuario.id)) {
            actualizado = [...actualizado, { usuario: otroUsuario }];
          }
          return actualizado;
        });
        api.put('/mensajes/leido', { remitenteId: otroUsuario.id }).catch(() => {});
      })
      .catch(() => setMensajes([]));
  };

  const enviarMensaje = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !usuarioActivo) return;
    if (!socket) return;
    socket.emit('mensajeDirecto', {
      remitenteId: usuario.id,
      destinatarioId: usuarioActivo.id,
      contenido: nuevoMensaje,
    });
    setMensajes(prev => [...prev, {
      id: `temp-${Date.now()}`,
      remitenteId: usuario.id,
      destinatarioId: usuarioActivo.id,
      contenido: nuevoMensaje,
      createdAt: new Date().toISOString(),
    }]);
    setNuevoMensaje('');
  };

  useEffect(() => {
    if (mensajesEndRef.current) mensajesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, usuarioActivo, open]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      const modal = document.querySelector('.chat-modal-pro');
      const toggleBtn = document.querySelector('.chat-toggle-btn');
      if (modal && !modal.contains(e.target) && toggleBtn && !toggleBtn.contains(e.target)) {
        setOpen(false);
        setUsuarioActivo(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleToggleChat = (e) => {
    if (open) {
      setOpen(false);
      setUsuarioActivo(null);
      if (e) e.stopPropagation();
      return;
    }
    setOpen(true);
  };

  const unreadCount = conversaciones.reduce((acc, conv) => {
    if (conv.ultimoMensaje && conv.ultimoMensaje.remitenteId !== usuario.id && !conv.ultimoMensaje.leido) {
      return acc + 1;
    }
    return acc;
  }, 0);

  if (!usuario) return null;

  return (
    <div className="chat-widget-fixed" style={{ pointerEvents: 'none' }}>
      <button className="chat-toggle-btn" onClick={handleToggleChat} type="button" style={{ pointerEvents: 'auto' }}>
        <FaComments size={28} />
        {unreadCount > 0 && <span className="chat-icon-badge-pro">{unreadCount}</span>}
      </button>
      {open && (
        <div className="chat-modal chat-modal-pro" style={{ pointerEvents: 'auto' }}>
          <div className="chat-tabs chat-tabs-pro">
            <button onClick={() => setTab('conversaciones')} className={tab === 'conversaciones' ? 'active' : ''} title="Conversaciones">
              <FaListUl />
              {unreadCount > 0 && <span className="chat-tab-badge-pro">{unreadCount}</span>}
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
                    <a href={`/perfil/${usuarioActivo.id}`} className="chat-nombre-link-pro" target="_blank" rel="noopener noreferrer">
                      Chat con {usuarioActivo.nombre}
                    </a>
                  </h4>
                  <button className="chat-back-btn-pro" onClick={() => setUsuarioActivo(null)} title="Volver">
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
                  <input type="text" value={nuevoMensaje} onChange={e => setNuevoMensaje(e.target.value)} placeholder="Escribe un mensaje..." />
                  <button type="submit" title="Enviar"><FaComment /></button>
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
                        <li key={conv.usuario.id} onClick={() => abrirChat(conv.usuario)}
                          className={`chat-list-item-pro ${usuarioActivo?.id === conv.usuario.id ? 'active' : ''}`}>
                          <div className="chat-avatar-pro">{conv.usuario?.nombre?.[0]?.toUpperCase() || 'U'}</div>
                          <div className="chat-list-info-pro">
                            <span className="chat-list-nombre-pro">
                              {conv.usuario?.nombre || 'Usuario'}
                              {conv.ultimoMensaje && conv.ultimoMensaje.remitenteId !== usuario.id &&
                                (!usuarioActivo || usuarioActivo.id !== conv.usuario.id) &&
                                !conv.ultimoMensaje.leido && <span className="chat-badge-pro" title="Nuevo mensaje" />}
                            </span>
                            {conv.ultimoMensaje && <span className="ultimo-mensaje chat-list-ultimo-pro">{conv.ultimoMensaje.contenido}</span>}
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
                      seguidores.filter(seg => !conversaciones.some(conv => conv.usuario.id === seg.id)).map(seg => (
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
