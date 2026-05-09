import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminUsuarios = ({ usuarios, abrirFormularioUsuario, eliminarUsuario }) => (
  <div className="bg-white border border-crema-300 rounded-2xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-crema-50 border-b border-crema-300">
            <th className="px-6 py-3 text-left text-xs font-semibold text-piedra-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-piedra-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-piedra-500 uppercase tracking-wider">Rol</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-piedra-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-crema-200">
          {usuarios.map((u) => (
            <tr key={u.id} className="hover:bg-crema-50/50 transition-colors">
              <td className="px-6 py-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-jaen-100 text-jaen-600 flex items-center justify-center text-xs font-semibold">
                    {u.nombre?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="font-medium text-piedra-900">{u.nombre}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-piedra-700">{u.email}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.rol === 'admin' ? 'bg-jaen-100 text-jaen-700' : 'bg-crema-200 text-piedra-700'}`}>
                  {u.rol}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="inline-flex gap-1">
                  <button onClick={() => abrirFormularioUsuario(u)} className="p-2 rounded-lg text-piedra-500 hover:text-jaen-600 hover:bg-jaen-50 transition-colors" title="Editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => eliminarUsuario(u.id)} className="p-2 rounded-lg text-piedra-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
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

export default AdminUsuarios;
