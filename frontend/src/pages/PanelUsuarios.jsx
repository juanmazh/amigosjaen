import { useEffect, useState } from 'react';
import api from '../api';
import React from 'react';

function PanelUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    api.get('/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      <ul>
        {usuarios.map(user => (
          <li key={user.id}>{user.nombre} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default PanelUsuarios;
