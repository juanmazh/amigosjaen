import React from "react";
//componente de /admin
const AdminEventos = ({ eventos, asistentesEventos, abrirFormularioEvento, eliminarEvento, MySwal }) => (
  <div className="bg-white shadow-lg rounded-xl p-6 overflow-x-auto">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-800">Gestión de Eventos</h2>
    </div>
    <table className="min-w-full divide-y divide-gray-200 rounded-xl overflow-hidden">
      <thead>
        <tr className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Título</th>
          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Descripción</th>
          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Fecha</th>
          <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Asistentes</th>
          <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {eventos.map((e, idx) => (
          <tr key={e.id} className={idx % 2 === 0 ? "bg-gray-50 hover:bg-emerald-50 transition" : "bg-white hover:bg-emerald-50 transition"}>
            <td className="px-6 py-4 whitespace-nowrap">{e.titulo}</td>
            <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">{e.descripcion}</td>
            <td className="px-6 py-4 whitespace-nowrap">{e.fecha ? new Date(e.fecha).toLocaleString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
              <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-semibold">{asistentesEventos[e.id]?.length || 0}</span>
              {asistentesEventos[e.id]?.length > 0 && (
                <button
                  className="ml-2 text-emerald-700 underline text-xs hover:text-emerald-900"
                  onClick={() => {
                    MySwal.fire({
                      title: `Asistentes de ${e.titulo}`,
                      html: `<ul style='text-align:left'>${asistentesEventos[e.id].map(a => `<li>${a.nombre} (${a.email})</li>`).join('')}</ul>`,
                      confirmButtonText: 'Cerrar',
                    });
                  }}
                >
                  Ver
                </button>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
              <button
                onClick={() => {
                  // Modal de edición con fecha y hora
                  const fechaValor = e.fecha ? e.fecha.slice(0,10) : '';
                  const horaValor = e.fecha ? new Date(e.fecha).toISOString().slice(11,16) : '';
                  MySwal.fire({
                    title: `Editar evento: ${e.titulo}`,
                    html:
                      `<label for='swal-titulo' style='display:block;text-align:left;font-weight:600;margin-bottom:2px;'>Título</label>` +
                      `<input id="swal-titulo" class="swal2-input" placeholder="Título" value="${e.titulo.replace(/"/g, '&quot;')}" />` +
                      `<label for='swal-descripcion' style='display:block;text-align:left;font-weight:600;margin:8px 0 2px 0;'>Descripción</label>` +
                      `<textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción">${e.descripcion.replace(/</g, '&lt;')}</textarea>` +
                      `<label for='swal-fecha' style='display:block;text-align:left;font-weight:600;margin:8px 0 2px 0;'>Fecha</label>` +
                      `<input id="swal-fecha" class="swal2-input" type="date" value="${fechaValor}" />` +
                      `<label for='swal-hora' style='display:block;text-align:left;font-weight:600;margin:8px 0 2px 0;'>Hora</label>` +
                      `<input id="swal-hora" class="swal2-input" type="time" value="${horaValor}" />`,
                    focusConfirm: false,
                    showCancelButton: true,
                    preConfirm: () => {
                      const titulo = document.getElementById('swal-titulo').value;
                      const descripcion = document.getElementById('swal-descripcion').value;
                      const fecha = document.getElementById('swal-fecha').value;
                      const hora = document.getElementById('swal-hora').value;
                      if (!titulo || !descripcion || !fecha || !hora) {
                        MySwal.showValidationMessage('Todos los campos son obligatorios');
                        return false;
                      }
                      // Combinar fecha y hora en formato ISO (ajustar si tu backend lo requiere)
                      let fechaHoraLocal = new Date(`${fecha}T${hora}`);
                      fechaHoraLocal.setHours(fechaHoraLocal.getHours());
                      const fechaHora = fechaHoraLocal.toISOString().slice(0, 16);
                      return { titulo, descripcion, fecha: fechaHora };
                    }
                  }).then(async (result) => {
                    if (result.isConfirmed && result.value) {
                      // Aquí deberías llamar a tu función de actualización de evento
                      await abrirFormularioEvento({ ...e, ...result.value });
                    }
                  });
                }}
                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm shadow transition-all duration-200"
              >
                <span className="material-icons text-base mr-1">Editar</span>
              </button>
              <button
                onClick={() => eliminarEvento(e.id)}
                className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm shadow transition-all duration-200"
              >
                <span className="material-icons text-base mr-1">Eliminar</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminEventos;
