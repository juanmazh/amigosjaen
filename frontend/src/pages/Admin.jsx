// Admin.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthContext from "../context/AuthContext";
import api from "../api";

function Admin() {
  const { usuario, cargando } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    if (cargando) return;
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
        .catch((err) => {
          console.error("Error al obtener usuarios", err);
          Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
        });
    }
  }, [usuario, cargando, navigate]);

  const eliminarUsuario = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await api.delete(`/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsuarios(usuarios.filter((u) => u.id !== id));
        Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error al eliminar usuario", error);
        Swal.fire("Error", "No se pudo eliminar el usuario", "error");
      }
    }
  };

  const handleActualizarUsuario = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(
        `/usuarios/${usuarioEditando.id}`,
        usuarioEditando,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuarioEditando.id ? res.data.usuario : u
        )
      );
      setUsuarioEditando(null);
      Swal.fire("Actualizado", "Usuario actualizado correctamente", "success");
    } catch (error) {
      console.error("Error al actualizar usuario", error);
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
      <ul className="space-y-2 mt-4">
        {usuarios.map((u) => (
          <li key={u.id} className="flex justify-between items-center border-b p-2">
            <span>
              {u.nombre} - {u.email} - {u.rol}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => setUsuarioEditando(u)}
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
        ))}
      </ul>

      {usuarioEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl relative">
            <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
            <form onSubmit={handleActualizarUsuario}>
              <div className="mb-4">
                <label className="block mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={usuarioEditando.nombre}
                  onChange={(e) =>
                    setUsuarioEditando({
                      ...usuarioEditando,
                      nombre: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded p-2"
                  value={usuarioEditando.email}
                  onChange={(e) =>
                    setUsuarioEditando({
                      ...usuarioEditando,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Rol</label>
                <select
                  className="w-full border rounded p-2"
                  value={usuarioEditando.rol}
                  onChange={(e) =>
                    setUsuarioEditando({
                      ...usuarioEditando,
                      rol: e.target.value,
                    })
                  }
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setUsuarioEditando(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
