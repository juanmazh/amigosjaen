import { createContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);  // Para manejar el estado de carga

  // useEffect para verificar si el token es válido cuando la aplicación carga
  useEffect(() => {
    if (token) {
      api.get('/auth/usuario', { headers: { 'x-auth-token': token } })
        .then(res => {
          setUsuario(res.data);
          setLoading(false);  // Detener el estado de carga después de verificar
        })
        .catch(() => {
          setToken(null);
          localStorage.removeItem('token');
          setLoading(false);  // Detener el estado de carga en caso de error
        });
    } else {
      setLoading(false);  // Si no hay token, terminar de cargar inmediatamente
    }
  }, [token]);

  // Función para hacer login
  const login = async (email, contraseña) => {
    try {
      const res = await api.post('/auth/login', { email, contraseña });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUsuario(res.data.usuario);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw new Error("Error al iniciar sesión");
    }
  };

  // Función para hacer logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setUsuario(null);
  };

  if (loading) {
    return <div>Cargando...</div>;  // Agregar una pantalla de carga si se está verificando el token
  }

  return (
    
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
