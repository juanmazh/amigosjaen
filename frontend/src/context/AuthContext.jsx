//  AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

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
      // const res = await axios.get('http://localhost:5000/api/auth/usuario', {
       const res = await axios.get('https://amigosjaen.onrender.com/api/auth/usuario', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsuario(res.data);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
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
    //const res = await axios.post('http://localhost:5000/api/auth/login', {
    const res = await axios.post('https://amigosjaen.onrender.com/api/auth/login', {
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
