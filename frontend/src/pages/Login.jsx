import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import jaenImage from '../assets/jaen.jpg'; // Asegúrate de tener esta imagen en la carpeta assets
//login
function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(email, contraseña);
      navigate('/');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl flex">
        <div className="w-1/2 pr-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Contraseña</label>
              <input
                type="password"
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
                value={contraseña}
                onChange={e => setContraseña(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
              Entrar
            </button>
          </form>
          <p className="text-sm text-center text-gray-600 mt-4">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
        <div className="w-1/2">
          <img src={jaenImage} alt="Jaén, España" className="rounded-xl shadow-md w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}

export default Login;
