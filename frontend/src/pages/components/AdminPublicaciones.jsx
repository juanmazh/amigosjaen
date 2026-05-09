import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminPublicaciones = ({ publicaciones, abrirFormularioPublicacion, eliminarPublicacion }) => (
  <div className="bg-white border border-crema-300 rounded-2xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-crema-50 border-b border-crema-300">
            <th className="px-6 py-3 text-left text-xs font-semibold text-piedra-500 uppercase tracking-wider">Título</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-piedra-500 uppercase tracking-wider">Contenido</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-piedra-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-crema-200">
          {publicaciones.map((p) => (
            <tr key={p.id} className="hover:bg-crema-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-piedra-900">{p.titulo}</td>
              <td className="px-6 py-4 text-sm text-piedra-500 max-w-md truncate">{p.contenido}</td>
              <td className="px-6 py-4 text-right">
                <div className="inline-flex gap-1">
                  <button onClick={() => abrirFormularioPublicacion(p)} className="p-2 rounded-lg text-piedra-500 hover:text-jaen-600 hover:bg-jaen-50 transition-colors" title="Editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => eliminarPublicacion(p.id)} className="p-2 rounded-lg text-piedra-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
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

export default AdminPublicaciones;
