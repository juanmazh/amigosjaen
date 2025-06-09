import React from "react";
//componente de /admin
const AdminPublicaciones = ({ publicaciones, abrirFormularioPublicacion, eliminarPublicacion }) => (
  <div className="bg-white shadow-lg rounded-xl p-6 mb-8 overflow-x-auto">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-800">Gestión de Publicaciones</h2>
    </div>
    <table className="min-w-full divide-y divide-gray-200 rounded-xl overflow-hidden">
      <thead>
        <tr className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Título</th>
          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Contenido</th>
          <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {publicaciones.map((p, idx) => (
          <tr key={p.id} className={idx % 2 === 0 ? "bg-gray-50 hover:bg-rose-50 transition" : "bg-white hover:bg-rose-50 transition"}>
            <td className="px-6 py-4 whitespace-nowrap">{p.titulo}</td>
            <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">{p.contenido}</td>
            <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
              <button
                onClick={() => abrirFormularioPublicacion(p)}
                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm shadow transition-all duration-200"
              >
                <span className="material-icons text-base mr-1">Editar</span>
              </button>
              <button
                onClick={() => eliminarPublicacion(p.id)}
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

export default AdminPublicaciones;
