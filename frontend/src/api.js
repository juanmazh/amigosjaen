import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo limpiar token si el backend dice que es inválido/expirado.
    // No limpiar en 403 generales (p.ej. "no eres admin") — el token sigue siendo válido.
    const msg = error.response?.data?.mensaje || error.response?.data?.msg || '';
    const tokenInvalido = error.response?.status === 401 ||
      (error.response?.status === 403 && /token/i.test(msg));
    if (tokenInvalido) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
