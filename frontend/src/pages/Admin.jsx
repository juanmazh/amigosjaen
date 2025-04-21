// src/pages/Admin.jsx
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Admin() {
  const { usuario, cargando } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    if (!cargando) {
      if (!usuario) {
        navigate('/login');
      } else if (usuario.rol !== 'admin') {
        navigate('/'); // O muestra un mensaje de acceso denegado
      } else {
        api.get('/usuarios')
          .then(res => setUsuarios(res.data))
          .catch(err => console.error('Error al obtener usuarios', err));
      }
    }
  }, [usuario, cargando]);

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      <ul>
        {usuarios.map(u => (
          <li key={u.id}>{u.nombre} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
