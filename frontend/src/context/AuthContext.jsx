import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerUsuario = async () => {
      if (!token) {
        setCargando(false);
        return;
      }
      try {
        const res = await api.get('/auth/usuario');
        setUsuario(res.data);
      } catch {
        setUsuario(null);
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuario();
  }, [token]);

  const login = async (email, contraseña) => {
    const res = await api.post('/auth/login', { email, contraseña });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUsuario(res.data.usuario);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  };

  const actualizarUsuario = (nuevosCampos) => {
    setUsuario((prev) => (prev ? { ...prev, ...nuevosCampos } : prev));
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando, actualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
