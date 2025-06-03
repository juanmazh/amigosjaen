// src/api.js
import axios from 'axios';

const api = axios.create({
//baseURL: 'https://amigosjaen.onrender.com/api' // en caso de producción
baseURL: 'http://localhost:5000/api' // Cambiado para desarrollo local
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
