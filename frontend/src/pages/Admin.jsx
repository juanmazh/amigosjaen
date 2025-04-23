// Admin.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import api from "../api";

function Admin() {
  const { usuario, cargando } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    console.log("Usuario:", usuario);
    console.log("Cargando:", cargando);

    if (cargando) return; // 👈 Evita redirección antes de verificar
    if (!usuario || usuario.rol !== "admin") {
      navigate("/login");
    } else {
      api
        .get("/usuarios", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setUsuarios(res.data))
        .catch((err) => console.error("Error al obtener usuarios", err));
    }
  }, [usuario, cargando, navigate]);

  // ... lo demás de tu componente (editar, eliminar, renderizado)

  const eliminarUsuario = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;
    try {
      await api.delete(`/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error al eliminar usuario', error);
    }
  };

  const editarUsuario = async (id, datosActualizados) => {
    try {
      const res = await api.put(`/usuarios/${id}`, datosActualizados, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsuarios(usuarios.map(u => u.id === id ? res.data.usuario : u));
    } catch (error) {
      console.error('Error al actualizar usuario', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
      <ul className="space-y-2 mt-4">
        {usuarios.map(u => (
          usuarioEditando === u.id ? (
            <li key={u.id} className="border-b p-2 space-y-2">
              <input
                type="text"
                value={datosEditados.nombre}
                onChange={e => setDatosEditados({ ...datosEditados, nombre: e.target.value })}
                className="border rounded p-1 mr-2"
                placeholder="Nombre"
              />
              <input
                type="email"
                value={datosEditados.email}
                onChange={e => setDatosEditados({ ...datosEditados, email: e.target.value })}
                className="border rounded p-1 mr-2"
                placeholder="Email"
              />
              <select
                value={datosEditados.rol}
                onChange={e => setDatosEditados({ ...datosEditados, rol: e.target.value })}
                className="border rounded p-1 mr-2"
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
              <button
                onClick={() => {
                  editarUsuario(u.id, datosEditados);
                  setUsuarioEditando(null);
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
              >
                Guardar
              </button>
              <button
                onClick={() => setUsuarioEditando(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded text-sm"
              >
                Cancelar
              </button>
            </li>
          ) : (
            <li key={u.id} className="flex justify-between items-center border-b p-2">
              <span>{u.nombre} - {u.email} - {u.rol}</span>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setUsuarioEditando(u.id);
                    setDatosEditados({ nombre: u.nombre, email: u.email, rol: u.rol });
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarUsuario(u.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Eliminar
                </button>
              </div>
            </li>
          )
        ))}
      </ul>
    </div>
  );
}

export default Admin;
