import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Comentarios from "./components/Comentarios";
import Swal from "sweetalert2";

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
    return (
      <div className="min-h-screen flex flex-col bg-crema-100">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-piedra-500">Cargando publicación…</p>
        </main>
        <Footer />
      </div>
    );
  }

  const esAutor = usuario && usuario.nombre === publicacion.autorNombre;

  const handleEliminar = async () => {
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
        await api.delete(`/publicaciones/${publicacion.id}`);
        Swal.fire('Eliminada', 'La publicación ha sido eliminada', 'success');
        setTimeout(() => { window.location.href = '/foro'; }, 1200);
      } catch {
        Swal.fire('Error', 'No se pudo eliminar la publicación', 'error');
      }
    }
  };

  const handleEditar = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar publicación',
      html:
        `<label style='display:block;text-align:left;font-weight:600;margin-bottom:2px;'>Título</label>` +
        `<input id="swal-titulo" class="swal2-input" value="${publicacion.titulo.replace(/"/g, '&quot;')}" />` +
        `<label style='display:block;text-align:left;font-weight:600;margin:8px 0 2px 0;'>Contenido</label>` +
        `<textarea id="swal-contenido" class="swal2-textarea">${publicacion.contenido.replace(/</g, '&lt;')}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const titulo = document.getElementById('swal-titulo').value;
        const contenido = document.getElementById('swal-contenido').value;
        if (!titulo || !contenido) { Swal.showValidationMessage('Todos los campos son obligatorios'); return false; }
        return { titulo, contenido };
      }
    });
    if (formValues) {
      try {
        const res = await api.put(`/publicaciones/${publicacion.id}`, formValues);
        setPublicacion({ ...publicacion, ...res.data });
        Swal.fire('Actualizada', 'La publicación ha sido actualizada', 'success');
      } catch {
        Swal.fire('Error', 'No se pudo actualizar la publicación', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-crema-100">
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <article className="bg-white border border-crema-300 rounded-3xl p-8 sm:p-10 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {publicacion.tags?.map((tag, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full bg-jaen-50 text-jaen-600">
                #{tag.nombre}
              </span>
            ))}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-jaen-700 font-semibold mb-4">{publicacion.titulo}</h1>
          <p className="text-sm text-piedra-500 mb-6 pb-6 border-b border-crema-300">
            por <span className="text-jaen-600 font-medium">{publicacion.autorNombre}</span>
          </p>
          <p className="text-piedra-700 leading-relaxed whitespace-pre-line">{publicacion.contenido}</p>

          {esAutor && (
            <div className="flex flex-wrap gap-3 pt-6 mt-6 border-t border-crema-300">
              <button onClick={handleEditar} className="px-5 py-2 rounded-full border border-piedra-500/30 text-piedra-700 font-medium hover:bg-piedra-500/5 transition-colors">
                Editar
              </button>
              <button onClick={handleEliminar} className="px-5 py-2 rounded-full text-red-600 hover:bg-red-50 font-medium transition-colors">
                Eliminar
              </button>
            </div>
          )}
        </article>

        <section className="bg-white border border-crema-300 rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-2xl text-jaen-700 font-semibold mb-5">Comentarios</h2>
          <Comentarios publicacionId={publicacion.id} onNuevoComentario={() => setRefrescarComentarios(!refrescarComentarios)} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default PublicacionDetalle;
