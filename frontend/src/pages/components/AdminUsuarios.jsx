import React from "react";

const AdminUsuarios = ({ usuarios, abrirFormularioUsuario, eliminarUsuario }) => (
  <div className="bg-white shadow-lg rounded-xl p-6 mb-8 overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 rounded-xl overflow-hidden">
      <thead>
        <tr className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Nombre</th>
          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Rol</th>
          <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {usuarios.map((u, idx) => (
          <tr key={u.id} className={idx % 2 === 0 ? "bg-gray-50 hover:bg-purple-50 transition" : "bg-white hover:bg-purple-50 transition"}>
            <td className="px-6 py-4 whitespace-nowrap">{u.nombre}</td>
            <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.rol === 'admin' ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-700'}`}>{u.rol}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
              <button
                onClick={() => abrirFormularioUsuario(u)}
                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm shadow transition-all duration-200"
              >
                <span className="material-icons text-base mr-1">Editar</span>
              </button>
              <button
                onClick={() => eliminarUsuario(u.id)}
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

export default AdminUsuarios;
