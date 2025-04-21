import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [cargando, setCargando] = useState(true);

  // Al iniciar la app, intenta obtener el usuario autenticado si hay token
  useEffect(() => {
    const obtenerUsuario = async () => {
      if (!token) {
        setCargando(false);
        return;
      }

      try {
        console.log("Token que se enviará:", token);
        const res = await axios.get('http://localhost:5000/api/auth/usuario', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
     
        setUsuario(res.data); // Aquí llegan los datos del usuario
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        setUsuario(null); // Token inválido o expirado
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuario();
  }, [token]);

  const login = async (email, contraseña) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      contraseña,
    });

    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUsuario(res.data.usuario);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
