import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        nombre,
        email,
        contraseña
      });

      alert('Usuario registrado correctamente');
      console.log('Token recibido:', res.data.token);
      
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || 'Error al registrar');
    }
  };

  return (
    <div>
      <h2>Registro de amigosjaen</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
