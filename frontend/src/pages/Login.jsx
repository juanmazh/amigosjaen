import { useState } from 'react';
import api from '../api'; // Asegúrate de tener tu configuración de axios

function Login() {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, contraseña });
      // Si la respuesta es exitosa, guarda el token en el localStorage
      localStorage.setItem('token', res.data.token);
      // Redirigir o hacer algo después del login exitoso
      window.location.href = '/'; // O redirige donde lo necesites
    } catch (error) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión en AmigosJaen</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
