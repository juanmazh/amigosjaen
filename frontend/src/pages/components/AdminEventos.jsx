import React from "react";
import { FaEdit, FaTrash, FaUsers } from "react-icons/fa";

const AdminEventos = ({ eventos, asistentesEventos, abrirFormularioEvento, eliminarEvento, MySwal }) => (
  <div className="bg-white border border-crema-300 rounded-2xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-crema-50 border-b border-crema-300">
            <th className="px-6 py-3 text-left text-xs font-semibold text-piedra-500 uppercase tracking-wider">Título</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-piedra-500 uppercase tracking-wider">Descripción</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-piedra-500 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-piedra-500 uppercase tracking-wider">Asistentes</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-piedra-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-crema-200">
          {eventos.map((e) => (
            <tr key={e.id} className="hover:bg-crema-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-piedra-900">{e.titulo}</td>
              <td className="px-6 py-4 text-sm text-piedra-500 max-w-xs truncate">{e.descripcion}</td>
              <td className="px-6 py-4 text-sm text-piedra-700">
                {e.fecha ? new Date(e.fecha).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
              </td>
              <td className="px-6 py-4 text-center text-sm">
                {asistentesEventos[e.id]?.length > 0 ? (
                  <button
                    onClick={() => MySwal.fire({
                      title: `Asistentes — ${e.titulo}`,
                      html: `<ul style='text-align:left'>${asistentesEventos[e.id].map(a => `<li>${a.nombre} (${a.email})</li>`).join('')}</ul>`,
                      confirmButtonText: 'Cerrar',
                    })}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-olivo-100 text-olivo-700 text-xs font-medium hover:bg-olivo-300/40 transition-colors"
                  >
                    <FaUsers className="text-xs" />
                    {asistentesEventos[e.id].length}
                  </button>
                ) : (
                  <span className="text-xs text-piedra-500">—</span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="inline-flex gap-1">
                  <button onClick={() => abrirFormularioEvento(e)} className="p-2 rounded-lg text-piedra-500 hover:text-jaen-600 hover:bg-jaen-50 transition-colors" title="Editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => eliminarEvento(e.id)} className="p-2 rounded-lg text-piedra-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminEventos;
