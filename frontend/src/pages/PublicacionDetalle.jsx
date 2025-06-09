import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import UserMenu from './components/UserMenu';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Swal from "sweetalert2";
import Comentarios from "./components/Comentarios";
// pagina de detalle de publicación
function PublicacionDetalle() {
  const { id } = useParams();
  const [publicacion, setPublicacion] = useState(null);
  const { usuario } = useContext(AuthContext);
  const [refrescarComentarios, setRefrescarComentarios] = useState(false);

  useEffect(() => {
    api.get(`/publicaciones/${id}`)
      .then(res => setPublicacion(res.data))
      .catch(err => console.error('Error al obtener la publicación:', err));
  }, [id]);

  if (!publicacion) {
    return <p>Cargando publicación...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 to-purple-200">
      <Header />
      <main className="flex-grow p-2 sm:p-4 md:p-6 max-w-full sm:max-w-2xl md:max-w-4xl mx-auto w-full">
        <div className="bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 break-words">{publicacion.titulo}</h2>
          <p className="text-gray-600 mb-2 sm:mb-4 break-words whitespace-pre-line">{publicacion.contenido}</p>
          <p className="text-xs sm:text-sm text-gray-400">Autor: {publicacion.autorNombre}</p>
          {publicacion.tags && publicacion.tags.length > 0 && (
            <div className="mt-2 sm:mt-4">
              <h4 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Etiquetas:</h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {publicacion.tags.map((tag, index) => (
                  <span key={index} className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs sm:text-sm">
                    {tag.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Botón de borrar si el usuario es el autor */}
          {usuario && usuario.nombre === publicacion.autorNombre && (
            <button
              className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-red-700 mt-3 sm:mt-4 text-sm sm:text-base"
              onClick={async () => {
                const confirm = await Swal.fire({
                  title: '¿Eliminar publicación?',
                  text: 'Esta acción no se puede deshacer',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Sí, borrar',
                  cancelButtonText: 'Cancelar',
                });
                if (confirm.isConfirmed) {
                  try {
                    await api.delete(`/publicaciones/${publicacion.id}`, {
                      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    Swal.fire('Eliminada', 'La publicación ha sido eliminada', 'success');
                    setTimeout(() => {
                      window.location.href = '/foro';
                    }, 1200);
                  } catch (err) {
                    Swal.fire('Error', 'No se pudo eliminar la publicación', 'error');
                  }
                }
              }}
            >
              Eliminar publicación
            </button>
          )}

          {/* Botón de editar si el usuario es el autor */}
          {usuario && usuario.nombre === publicacion.autorNombre && (
            <button
              className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 mt-3 sm:mt-4 mr-2 text-sm sm:text-base"
              onClick={async () => {
                const { value: formValues } = await Swal.fire({
                  title: 'Editar publicación',
                  html:
                    `<label for='swal-titulo' style='display:block;text-align:left;font-weight:600;margin-bottom:2px;'>Título</label>` +
                    `<input id="swal-titulo" class="swal2-input" placeholder="Título" value="${publicacion.titulo.replace(/"/g, '&quot;')}" />` +
                    `<label for='swal-contenido' style='display:block;text-align:left;font-weight:600;margin:8px 0 2px 0;'>Descripción</label>` +
                    `<textarea id="swal-contenido" class="swal2-textarea" placeholder="Contenido">${publicacion.contenido.replace(/</g, '&lt;')}</textarea>`,
                  focusConfirm: false,
                  showCancelButton: true,
                  preConfirm: () => {
                    const titulo = document.getElementById('swal-titulo').value;
                    const contenido = document.getElementById('swal-contenido').value;
                    if (!titulo || !contenido) {
                      Swal.showValidationMessage('Todos los campos son obligatorios');
                      return false;
                    }
                    return { titulo, contenido };
                  }
                });
                if (formValues) {
                  try {
                    const res = await api.put(`/publicaciones/${publicacion.id}`, {
                      titulo: formValues.titulo,
                      contenido: formValues.contenido
                    }, {
                      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setPublicacion({ ...publicacion, ...res.data });
                    Swal.fire('Actualizada', 'La publicación ha sido actualizada', 'success');
                  } catch (err) {
                    Swal.fire('Error', 'No se pudo actualizar la publicación', 'error');
                  }
                }
              }}
            >
              Editar publicación
            </button>
          )}
        </div>

        <div className="bg-white/80 shadow-inner rounded-lg p-2 sm:p-4">
          <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Comentarios</h3>
          <Comentarios publicacionId={publicacion.id} onNuevoComentario={() => setRefrescarComentarios(!refrescarComentarios)} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PublicacionDetalle;