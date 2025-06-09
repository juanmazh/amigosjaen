import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import jaenImage from '../assets/jaen.jpg'; // Asegúrate de tener esta imagen en la carpeta assets
// pagina de registro de usuario
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
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl flex">
        <div className="w-1/2">
          <img src={jaenImage} alt="Jaén, España" className="rounded-xl shadow-md w-full h-full object-cover" />
        </div>
        <div className="w-1/2 pl-4">
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
          <p className="text-sm text-center text-gray-600 mt-4">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-green-600 hover:underline">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
