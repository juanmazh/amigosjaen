import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import jaenImage from '../assets/jaen.jpg';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login(email, contraseña);
      navigate('/');
    } catch {
      setError('Credenciales incorrectas');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-crema-100 p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-crema-300 overflow-hidden grid md:grid-cols-2">
        <div className="hidden md:block relative">
          <img src={jaenImage} alt="Jaén" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-jaen-700/70 via-jaen-500/30 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <p className="text-xs uppercase tracking-[0.2em] opacity-80 mb-2">Bienvenido a casa</p>
            <p className="font-display text-3xl leading-tight">
              Tu plaza digital,<br />en tu tierra.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <Link to="/" className="font-display text-2xl text-jaen-600 font-semibold mb-8 inline-block hover:text-jaen-700">
            AmigosJaén
          </Link>
          <h2 className="font-display text-3xl text-piedra-900 font-semibold mb-2">Iniciar sesión</h2>
          <p className="text-piedra-500 text-sm mb-8">Vuelve a conectar con tu comunidad.</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-piedra-700 mb-1.5">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2.5 rounded-lg border border-crema-300 bg-crema-50 focus:bg-white focus:border-jaen-400 focus:ring-2 focus:ring-jaen-200 outline-none transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-piedra-700 mb-1.5">Contraseña</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 rounded-lg border border-crema-300 bg-crema-50 focus:bg-white focus:border-jaen-400 focus:ring-2 focus:ring-jaen-200 outline-none transition-all"
                value={contraseña}
                onChange={e => setContraseña(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3 rounded-full bg-jaen-500 text-white font-medium hover:bg-jaen-600 shadow-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {cargando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className="text-sm text-center text-piedra-500 mt-8">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-jaen-600 hover:text-jaen-700 font-medium">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
