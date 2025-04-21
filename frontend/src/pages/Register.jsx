import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { nombre, email, contraseña });
      setOk(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Error al registrar usuario');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-teal-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Registro de Usuario</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {ok && <p className="text-green-500 text-sm mb-4 text-center">Usuario registrado con éxito 🎉</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Nombre</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-green-300"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-green-300"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Contraseña</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-green-300"
              value={contraseña}
              onChange={e => setContraseña(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
