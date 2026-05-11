import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { usuario } = useContext(AuthContext);
  const socketRef = useRef(null);
  // Forzamos re-render cuando el socket se conecta/desconecta para que los consumidores
  // se enteren (sino useRef no provoca render).
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!usuario) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setTick((t) => t + 1);
      }
      return;
    }

    // Si ya existe socket, lo reutilizamos (no abrir otro)
    if (socketRef.current) return;

    const s = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = s;

    s.on('connect', () => {
      s.emit('registrarUsuario', usuario.id);
      setTick((t) => t + 1);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [usuario]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
