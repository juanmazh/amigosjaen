import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
        // Obtener asistentes
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
    // eslint-disable-next-line
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

  // Calcular estado del evento
  let estadoEvento = "";
  if (evento && evento.fecha) {
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const fechaEvento = new Date(evento.fecha);
    fechaEvento.setHours(0,0,0,0);
    if (fechaEvento < hoy) {
      estadoEvento = "Finalizado";
    } else if (fechaEvento.getTime() === hoy.getTime()) {
      estadoEvento = "Hoy";
    } else {
      estadoEvento = "Próximo";
    }
  }

  if (!evento) {
    return <p>Cargando evento...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 to-purple-200">
      <Header />
      <main className="flex-grow flex justify-center items-center mt-8 mb-8">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-4xl w-full">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Galería de imágenes */}
            <div className="md:w-1/2 w-full flex flex-col gap-2">
              {(() => {
                let imagenes = [];
                if (Array.isArray(evento.imagenes)) {
                  imagenes = evento.imagenes;
                } else if (evento.imagenes) {
                  try {
                    imagenes = JSON.parse(evento.imagenes);
                  } catch {
                    imagenes = [];
                  }
                }
                if (imagenes.length === 0) {
                  return <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">Sin imágenes</div>;
                }
                return (
                  <div className="flex flex-col gap-2">
                    {imagenes.map((img, idx) => (
                      <img key={idx} src={img} alt={`Evento ${evento.titulo}`} className="w-full h-48 object-cover rounded" />
                    ))}
                  </div>
                );
              })()}
            </div>
            {/* Detalles del evento */}
            <div className="md:w-1/2 w-full flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-purple-700 mb-2">{evento.titulo}</h1>
              {/* Etiquetas asociadas al evento */}
              {evento.eventosTags && evento.eventosTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {evento.eventosTags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs"
                    >
                      #{tag.nombre}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-gray-700 mb-2 whitespace-pre-line">{evento.descripcion}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-600">Fecha:</span>
                <span className="text-gray-800">{new Date(evento.fecha).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-600">Estado:</span>
                {estadoEvento && (
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${estadoEvento === 'Finalizado' ? 'bg-red-200 text-red-800' : estadoEvento === 'Hoy' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>{estadoEvento}</span>
                )}
              </div>
              {/* Localización */}
              {evento.localizacion && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-600">Localización:</span>
                  <span className="text-gray-800">{typeof evento.localizacion === 'string' ? evento.localizacion : JSON.stringify(evento.localizacion)}</span>
                </div>
              )}
              {/* Localización en mapa si es válida */}
              {evento.localizacion && (() => {
                // Intentar extraer lat/lng de la localización
                let lat = null, lng = null;
                if (typeof evento.localizacion === 'string' && evento.localizacion.includes(',')) {
                  const parts = evento.localizacion.split(',');
                  lat = parseFloat(parts[0]);
                  lng = parseFloat(parts[1]);
                }
                if (!isNaN(lat) && !isNaN(lng)) {
                  return (
                    <div className="my-4">
                      <div className="font-semibold text-gray-600 mb-1">Localización:</div>
                      <div className="w-full h-64 rounded overflow-hidden">
                        <iframe
                          title="Mapa del evento"
                          width="100%"
                          height="100%"
                          style={{ border: 0, borderRadius: '0.5rem' }}
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01}%2C${lat-0.01}%2C${lng+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lng}`}
                          allowFullScreen=""
                          loading="lazy"
                        ></iframe>
                        <div className="text-xs text-gray-500 mt-1">
                          <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`} target="_blank" rel="noopener noreferrer" className="underline">Ver en OpenStreetMap</a>
                        </div>
                      </div>
                    </div>
                  );
                }
                // Si no es coordenada, mostrar como texto
                return (
                  <div className="my-4">
                    <span className="font-semibold text-gray-600">Localización:</span>
                    <span className="text-gray-800 ml-2">{evento.localizacion}</span>
                  </div>
                );
              })()}
              {/* Asistentes */}
              <div className="mb-2">
                <span className="font-semibold text-gray-600">Asistentes:</span>
                <span className="ml-2">{asistentes.length}</span>
                {asistentes.length > 0 && (
                  <button
                    className="ml-2 text-blue-600 underline text-xs"
                    onClick={async () => {
                      if (usuario && usuario.id === evento.usuarioId) {
                        // Si es el creador, mostrar lista con opción de eliminar
                        const { value: eliminado } = await Swal.fire({
                          title: 'Asistentes',
                          html: `<ul style='text-align:left;list-style:none;padding:0;'>${asistentes.map(a => `
                            <li style='margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;'>
                              <span>${a.nombre}</span>
                              <button data-id='${a.id}' class='swal2-remove-asistente' style='background:#ef4444;color:white;border:none;padding:4px 10px;border-radius:5px;cursor:pointer;display:inline-flex;align-items:center;font-size:13px;'>
                                <svg xmlns='http://www.w3.org/2000/svg' style='width:16px;height:16px;margin-right:4px' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12'/></svg>
                                Eliminar
                              </button>
                            </li>`).join('')}</ul>` +
                                `<div class='text-xs text-gray-500 mt-2'>Pulsa "Eliminar" para quitar un asistente</div>`,
                          showCancelButton: true,
                          showConfirmButton: false,
                          didOpen: () => {
                            document.querySelectorAll('.swal2-remove-asistente').forEach(btn => {
                              btn.addEventListener('click', async (e) => {
                                const userId = btn.getAttribute('data-id');
                                const confirm = await Swal.fire({
                                  title: '¿Eliminar asistente?',
                                  text: 'Esta acción no se puede deshacer',
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonText: 'Sí, eliminar',
                                  cancelButtonText: 'Cancelar',
                                });
                                if (confirm.isConfirmed) {
                                  try {
                                    await api.delete(`/eventos/${evento.id}/asistentes/${userId}`, {
                                      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                                    });
                                    Swal.fire('Eliminado', 'El asistente ha sido eliminado', 'success');
                                    setAsistentes(prev => prev.filter(a => a.id !== parseInt(userId)));
                                    Swal.close();
                                  } catch (err) {
                                    Swal.fire('Error', 'No se pudo eliminar el asistente', 'error');
                                  }
                                }
                              });
                            });
                          }
                        });
                      } else {
                        Swal.fire({
                          title: `Asistentes`,
                          html: `<ul style='text-align:left'>${asistentes.map(a => `<li>${a.nombre}</li>`).join('')}</ul>`,
                          confirmButtonText: 'Cerrar',
                        });
                      }
                    }}
                  >
                    Ver
                  </button>
                )}
              </div>
              {/* Botón inscribirse */}
              {usuario && !yaInscrito && (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
                  onClick={inscribirse}
                >
                  Inscribirse al evento
                </button>
              )}
              {!usuario && (
                <div className="text-yellow-700 font-semibold mt-2">Inicia sesión para inscribirte al evento</div>
              )}
              {usuario && yaInscrito && (
                <div className="text-green-700 font-semibold mt-2">Ya estás inscrito en este evento</div>
              )}
              {/* Botón de borrar si el usuario es el autor */}
              {usuario && usuario.id === evento.usuarioId && (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
                  onClick={async () => {
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
                        await api.delete(`/eventos/${evento.id}`, {
                          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                        });
                        Swal.fire('Eliminado', 'El evento ha sido eliminado', 'success');
                        setTimeout(() => {
                          window.location.href = '/eventos';
                        }, 1200);
                      } catch (err) {
                        Swal.fire('Error', 'No se pudo eliminar el evento', 'error');
                      }
                    }
                  }}
                >
                  Eliminar evento
                </button>
              )}
              {/* Botón de editar evento para el creador o admin */}
              {usuario && (usuario.id === evento.usuarioId || usuario.rol === 'admin') && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4 w-full"
                  onClick={async () => {
                    // Obtener fecha y hora actuales del evento
                    let fechaValor = evento.fecha ? evento.fecha.slice(0,10) : '';
                    let horaValor = evento.fecha ? new Date(evento.fecha).toISOString().slice(11,16) : '';
                    const { value: formValues } = await Swal.fire({
                      title: 'Editar evento',
                      html:
                        `<label for='swal-titulo' style='display:block;text-align:left;font-weight:600;margin-bottom:2px;'>Título</label>` +
                        `<input id="swal-titulo" class="swal2-input" placeholder="Título" value="${evento.titulo.replace(/"/g, '&quot;')}" />` +
                        `<label for='swal-descripcion' style='display:block;text-align:left;font-weight:600;margin:8px 0 2px 0;'>Descripción</label>` +
                        `<textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción">${evento.descripcion.replace(/</g, '&lt;')}</textarea>` +
                        `<label for='swal-fecha' style='display:block;text-align:left;font-weight:600;margin:8px 0 2px 0;'>Fecha</label>` +
                        `<input id="swal-fecha" class="swal2-input" type="date" value="${fechaValor}" />` +
                        `<label for='swal-hora' style='display:block;text-align:left;font-weight:600;margin:8px 0 2px 0;'>Hora</label>` +
                        `<input id="swal-hora" class="swal2-input" type="time" value="${horaValor}" />` +
                        `<label for='swal-localizacion' style='display:block;text-align:left;font-weight:600;margin:8px 0 2px 0;'>Localización (dirección o lat,lng)</label>` +
                        `<input id="swal-localizacion" class="swal2-input" placeholder="Calle ejemplo, ciudad" value="${evento.localizacion || ''}" />` +
                        `<label for='swal-etiquetas' style='display:block;text-align:left;font-weight:600;margin:8px 0 2px 0;'>Etiquetas (separadas por coma)</label>` +
                        `<input id="swal-etiquetas" class="swal2-input" placeholder="etiqueta1,etiqueta2" value="${evento.eventosTags ? evento.eventosTags.map(t=>t.nombre).join(',') : ''}" />`,
                      focusConfirm: false,
                      showCancelButton: true,
                      preConfirm: () => {
                        const titulo = document.getElementById('swal-titulo').value;
                        const descripcion = document.getElementById('swal-descripcion').value;
                        const fecha = document.getElementById('swal-fecha').value;
                        const hora = document.getElementById('swal-hora').value;
                        const localizacion = document.getElementById('swal-localizacion').value;
                        const etiquetas = document.getElementById('swal-etiquetas').value.split(',').map(e=>e.trim()).filter(Boolean);
                        if (!titulo || !descripcion || !fecha || !hora) {
                          Swal.showValidationMessage('Título, descripción, fecha y hora son obligatorios');
                          return false;
                        }
                        return { titulo, descripcion, fecha, hora, localizacion, etiquetas };
                      }
                    });
                    if (formValues) {
                      let localizacionFinal = formValues.localizacion;
                      // Si no es coordenada, geocodifica
                      if (localizacionFinal && !/^[-+]?\d+(\.\d+)?\s*,\s*[-+]?\d+(\.\d+)?$/.test(localizacionFinal)) {
                        try {
                          const resGeo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(localizacionFinal)}`);
                          const dataGeo = await resGeo.json();
                          if (dataGeo.length > 0) {
                            localizacionFinal = `${dataGeo[0].lat},${dataGeo[0].lon}`;
                          } else {
                            await Swal.fire('Error', 'No se pudo encontrar la dirección. Se guardará el texto tal cual.', 'warning');
                          }
                        } catch (e) {
                          await Swal.fire('Error', 'No se pudo geocodificar la dirección. Se guardará el texto tal cual.', 'warning');
                        }
                      }
                      // Combinar fecha y hora y ajustar -2h para compensar la base de datos
                      let fechaHoraLocal = new Date(`${formValues.fecha}T${formValues.hora}`);
                      fechaHoraLocal.setHours(fechaHoraLocal.getHours() - 2);
                      const fechaHora = fechaHoraLocal.toISOString().slice(0, 16);
                      try {
                        const res = await api.put(`/eventos/${evento.id}`,
                          { ...formValues, fecha: fechaHora, localizacion: localizacionFinal },
                          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                        );
                        setEvento(res.data);
                        Swal.fire('Actualizado', 'El evento ha sido actualizado', 'success');
                      } catch (err) {
                        Swal.fire('Error', 'No se pudo actualizar el evento', 'error');
                      }
                    }
                  }}
                >
                  Editar evento
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EventoDetalle;
