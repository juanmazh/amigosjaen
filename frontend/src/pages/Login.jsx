import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';  // Asegúrate de que esta importación esté correcta

function Login() {
  const { login } = useContext(AuthContext);  // Accede al contexto aquí
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, contraseña);
    } catch (error) {
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
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
    </div>
  );
}

export default Login;
