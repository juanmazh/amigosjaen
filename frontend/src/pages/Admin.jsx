// src/pages/Admin.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api';

function Admin() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => { 
    if (!usuario) {
      navigate('/login');
    } else {
      api.get('/usuarios')
        .then(res => setUsuarios(res.data))
        .catch(err => console.error('Error al obtener usuarios', err));
    }
  }, [usuario]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
      <ul className="space-y-2">
        {usuarios.map(u => (
          <li key={u.id} className="bg-white rounded shadow p-4">
            <p className="text-lg font-medium">{u.nombre}</p>
            <p className="text-sm text-gray-600">{u.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
