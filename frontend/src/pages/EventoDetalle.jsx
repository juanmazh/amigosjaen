import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaCalendar, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import api from "../api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

function EventoDetalle() {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [asistentes, setAsistentes] = useState([]);
  const [yaInscrito, setYaInscrito] = useState(false);
  const { usuario } = useAuth();

  useEffect(() => {
    const cargarEvento = async () => {
      try {
        const res = await api.get(`/eventos/${id}`);
        setEvento(res.data);
        const resAsist = await api.get(`/eventos/${id}/asistentes`);
        setAsistentes(resAsist.data);
        if (usuario && resAsist.data) {
          setYaInscrito(resAsist.data.some(a => a.id === usuario.id));
        } else {
          setYaInscrito(false);
        }
      } catch (err) {
        console.error("Error al cargar el evento:", err);
      }
    };
    cargarEvento();
  }, [id, usuario]);

  const inscribirse = async () => {
    try {
      await api.post(`/eventos/${id}/asistir`);
      Swal.fire("Inscrito", "Te has inscrito correctamente al evento", "success");
      setYaInscrito(true);
      setAsistentes(prev => [...prev, usuario]);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || "No se pudo inscribir", "error");
    }
  };

  const desapuntarse = async () => {
    try {
      await api.delete(`/eventos/${id}/asistir`);
      Swal.fire("Desapuntado", "Te has desapuntado del evento", "success");
      setYaInscrito(false);
      setAsistentes(prev => prev.filter(a => a.id !== usuario.id));
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || "No se pudo desapuntar", "error");
    }
  };

  let estadoEvento = "";
  let estadoClass = "";
  if (evento && evento.fecha) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaEvento = new Date(evento.fecha);
    fechaEvento.setHours(0, 0, 0, 0);
    if (fechaEvento < hoy) { estadoEvento = "Finalizado"; estadoClass = "bg-piedra-500/10 text-piedra-700"; }
    else if (fechaEvento.getTime() === hoy.getTime()) { estadoEvento = "Hoy"; estadoClass = "bg-ambar-300/30 text-ambar-700"; }
    else { estadoEvento = "Próximo"; estadoClass = "bg-olivo-100 text-olivo-700"; }
  }

  if (!evento) {
    return (
      <div className="min-h-screen flex flex-col bg-crema-100">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-piedra-500">Cargando evento…</p>
        </main>
        <Footer />
      </div>
    );
  }

  let imagenes = [];
  if (Array.isArray(evento.imagenes)) imagenes = evento.imagenes;
  else if (evento.imagenes) {
    try { imagenes = JSON.parse(evento.imagenes); } catch { imagenes = []; }
  }

  let lat = null, lng = null;
  if (typeof evento.localizacion === 'string' && evento.localizacion.includes(',')) {
    const parts = evento.localizacion.split(',');
    lat = parseFloat(parts[0]);
    lng = parseFloat(parts[1]);
  }

  const handleEliminar = async () => {
    const confirm = await Swal.fire({
      title: '¿Eliminar evento?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/eventos/${evento.id}`);
        Swal.fire('Eliminado', 'El evento ha sido eliminado', 'success');
        setTimeout(() => { window.location.href = '/eventos'; }, 1200);
      } catch {
        Swal.fire('Error', 'No se pudo eliminar el evento', 'error');
      }
    }
  };

  const handleEditar = async () => {
    let fechaValor = evento.fecha ? evento.fecha.slice(0, 10) : '';
    let horaValor = evento.fecha ? new Date(evento.fecha).toISOString().slice(11, 16) : '';
    const { value: formValues } = await Swal.fire({
      title: 'Editar evento',
      html:
        `<label style='display:block;text-align:left;font-weight:600;margin-bottom:2px;'>Título</label>` +
        `<input id="swal-titulo" class="swal2-input" value="${evento.titulo.replace(/"/g, '&quot;')}" />` +
        `<label style='display:block;text-align:left;font-weight:600;margin:8px 0 2px 0;'>Descripción</label>` +
        `<textarea id="swal-descripcion" class="swal2-textarea">${evento.descripcion.replace(/</g, '&lt;')}</textarea>` +
        `<label style='display:block;text-align:left;font-weight:600;margin:8px 0 2px 0;'>Fecha</label>` +
        `<input id="swal-fecha" class="swal2-input" type="date" value="${fechaValor}" />` +
        `<label style='display:block;text-align:left;font-weight:600;margin:8px 0 2px 0;'>Hora</label>` +
        `<input id="swal-hora" class="swal2-input" type="time" value="${horaValor}" />` +
        `<label style='display:block;text-align:left;font-weight:600;margin:8px 0 2px 0;'>Localización</label>` +
        `<input id="swal-localizacion" class="swal2-input" value="${evento.localizacion || ''}" />` +
        `<label style='display:block;text-align:left;font-weight:600;margin:8px 0 2px 0;'>Etiquetas (separadas por coma)</label>` +
        `<input id="swal-etiquetas" class="swal2-input" value="${evento.eventosTags ? evento.eventosTags.map(t => t.nombre).join(',') : ''}" />`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const titulo = document.getElementById('swal-titulo').value;
        const descripcion = document.getElementById('swal-descripcion').value;
        const fecha = document.getElementById('swal-fecha').value;
        const hora = document.getElementById('swal-hora').value;
        const localizacion = document.getElementById('swal-localizacion').value;
        const etiquetas = document.getElementById('swal-etiquetas').value.split(',').map(e => e.trim()).filter(Boolean);
        if (!titulo || !descripcion || !fecha || !hora) {
          Swal.showValidationMessage('Título, descripción, fecha y hora son obligatorios');
          return false;
        }
        return { titulo, descripcion, fecha, hora, localizacion, etiquetas };
      }
    });
    if (formValues) {
      let localizacionFinal = formValues.localizacion;
      if (localizacionFinal && !/^[-+]?\d+(\.\d+)?\s*,\s*[-+]?\d+(\.\d+)?$/.test(localizacionFinal)) {
        try {
          const resGeo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(localizacionFinal)}`);
          const dataGeo = await resGeo.json();
          if (dataGeo.length > 0) localizacionFinal = `${dataGeo[0].lat},${dataGeo[0].lon}`;
        } catch {}
      }
      const fechaHora = new Date(`${formValues.fecha}T${formValues.hora}`).toISOString().slice(0, 16);
      try {
        const res = await api.put(`/eventos/${evento.id}`, { ...formValues, fecha: fechaHora, localizacion: localizacionFinal });
        setEvento(res.data);
        Swal.fire('Actualizado', 'El evento ha sido actualizado', 'success');
      } catch {
        Swal.fire('Error', 'No se pudo actualizar el evento', 'error');
      }
    }
  };

  const handleVerAsistentes = async () => {
    if (usuario && usuario.id === evento.usuarioId) {
      await Swal.fire({
        title: 'Asistentes',
        html: `<ul style='text-align:left;list-style:none;padding:0;'>${asistentes.map(a => `
          <li style='margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;'>
            <span>${a.nombre}</span>
            <button data-id='${a.id}' class='swal2-remove-asistente' style='background:#5B2A86;color:white;border:none;padding:4px 10px;border-radius:5px;cursor:pointer;font-size:13px;'>Eliminar</button>
          </li>`).join('')}</ul>`,
        showCancelButton: true,
        showConfirmButton: false,
        didOpen: () => {
          document.querySelectorAll('.swal2-remove-asistente').forEach(btn => {
            btn.addEventListener('click', async () => {
              const userId = btn.getAttribute('data-id');
              const confirm = await Swal.fire({
                title: '¿Eliminar asistente?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
              });
              if (confirm.isConfirmed) {
                try {
                  await api.delete(`/eventos/${evento.id}/asistentes/${userId}`);
                  Swal.fire('Eliminado', 'El asistente ha sido eliminado', 'success');
                  setAsistentes(prev => prev.filter(a => a.id !== parseInt(userId)));
                  Swal.close();
                } catch {
                  Swal.fire('Error', 'No se pudo eliminar el asistente', 'error');
                }
              }
            });
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Asistentes',
        html: `<ul style='text-align:left'>${asistentes.map(a => `<li>${a.nombre}</li>`).join('')}</ul>`,
        confirmButtonText: 'Cerrar',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-crema-100">
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        <article className="bg-white border border-crema-300 rounded-3xl overflow-hidden shadow-sm">
          {imagenes.length > 0 && (
            <div className="aspect-[16/7] overflow-hidden bg-crema-200">
              <img src={imagenes[0]} alt={evento.titulo} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {estadoEvento && (
                <span className={`text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full ${estadoClass}`}>
                  {estadoEvento}
                </span>
              )}
              {evento.eventosTags?.map((tag) => (
                <span key={tag.id} className="text-xs px-3 py-1 rounded-full bg-jaen-50 text-jaen-600">
                  #{tag.nombre}
                </span>
              ))}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl text-jaen-700 font-semibold mb-6">{evento.titulo}</h1>

            <div className="grid sm:grid-cols-3 gap-4 mb-8 pb-8 border-b border-crema-300">
              <div className="flex items-start gap-3">
                <FaCalendar className="text-jaen-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-piedra-500 mb-0.5">Fecha</p>
                  <p className="text-sm text-piedra-700">{new Date(evento.fecha).toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              {evento.localizacion && (
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-jaen-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-piedra-500 mb-0.5">Lugar</p>
                    <p className="text-sm text-piedra-700">{evento.localizacion}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <FaUsers className="text-jaen-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-piedra-500 mb-0.5">Asistentes</p>
                  <button onClick={handleVerAsistentes} className="text-sm text-piedra-700 hover:text-jaen-600 underline-offset-2 hover:underline">
                    {asistentes.length} {asistentes.length === 1 ? 'persona' : 'personas'}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-piedra-700 whitespace-pre-line leading-relaxed mb-8">{evento.descripcion}</p>

            {!isNaN(lat) && !isNaN(lng) && lat !== null && lng !== null && (
              <div className="mb-8 rounded-2xl overflow-hidden border border-crema-300">
                <iframe
                  title="Mapa del evento"
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`}
                  loading="lazy"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {usuario && estadoEvento !== 'Finalizado' && !yaInscrito && (
                <button onClick={inscribirse} className="px-6 py-3 rounded-full bg-jaen-500 text-white font-medium hover:bg-jaen-600 shadow-sm hover:shadow transition-all">
                  Inscribirme
                </button>
              )}
              {usuario && estadoEvento !== 'Finalizado' && yaInscrito && (
                <button onClick={desapuntarse} className="px-6 py-3 rounded-full border border-jaen-500 text-jaen-600 font-medium hover:bg-jaen-50 transition-colors">
                  Desapuntarme
                </button>
              )}
              {!usuario && (
                <p className="text-sm text-piedra-500 italic">Inicia sesión para inscribirte.</p>
              )}
              {usuario && (usuario.id === evento.usuarioId || usuario.rol === 'admin') && (
                <button onClick={handleEditar} className="px-6 py-3 rounded-full border border-piedra-500/30 text-piedra-700 font-medium hover:bg-piedra-500/5 transition-colors">
                  Editar
                </button>
              )}
              {usuario && usuario.id === evento.usuarioId && (
                <button onClick={handleEliminar} className="px-6 py-3 rounded-full text-red-600 hover:bg-red-50 font-medium transition-colors">
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export default EventoDetalle;
