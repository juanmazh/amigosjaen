import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AuthContext from "../context/AuthContext";
import api from "../api";

const MySwal = withReactContent(Swal);

function Admin() {
  const { usuario, cargando } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    if (cargando) return;
    if (!usuario || usuario.rol !== "admin") {
      navigate("/login");
    } else {
      cargarUsuarios();
    }
  }, [usuario, cargando, navigate]);

  const cargarUsuarios = () => {
    api
      .get("/usuarios", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setUsuarios(res.data))
      .catch(() =>
        Swal.fire("Error", "No se pudieron cargar los usuarios", "error")
      );
  };

  const eliminarUsuario = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await api.delete(`/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
        Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el usuario", "error");
      }
    }
  };

  const abrirFormularioUsuario = (usuarioInicial = null) => {
    MySwal.fire({
      title: usuarioInicial ? "Editar Usuario" : "Nuevo Usuario",
      html: (
        <div className="flex flex-col space-y-3">
          <input
            id="swal-nombre"
            className="swal2-input"
            defaultValue={usuarioInicial?.nombre || ""}
            placeholder="Nombre"
          />
          <input
            id="swal-email"
            className="swal2-input"
            type="email"
            defaultValue={usuarioInicial?.email || ""}
            placeholder="Email"
          />
          <input
            id="swal-password"
            className="swal2-input"
            type="password"
            placeholder="Contraseña"
          />
          <select id="swal-rol" className="swal2-select" defaultValue={usuarioInicial?.rol || "cliente"}>
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: usuarioInicial ? "Actualizar" : "Crear",
      preConfirm: () => {
        const nombre = document.getElementById("swal-nombre").value;
        const email = document.getElementById("swal-email").value;
        const password = document.getElementById("swal-password").value;
        const rol = document.getElementById("swal-rol").value;

        if (!nombre || !email || !password || !rol) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
        }

        return { nombre, email, password, rol };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const datos = result.value;
        try {
          if (usuarioInicial) {
            const res = await api.put(`/usuarios/${usuarioInicial.id}`, datos, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setUsuarios((prev) =>
              prev.map((u) => (u.id === usuarioInicial.id ? res.data.usuario : u))
            );
            Swal.fire("Actualizado", "Usuario actualizado correctamente", "success");
          } else {
            const res = await api.post(`/usuarios`, datos, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setUsuarios((prev) => [...prev, res.data.usuario]);
            Swal.fire("Creado", "Usuario creado correctamente", "success");
          }
        } catch (error) {
          Swal.fire("Error", "No se pudo guardar el usuario", "error");
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow rounded-lg p-6 mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <div className="space-x-4">
          <button
            onClick={() => abrirFormularioUsuario()}
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:from-purple-600 hover:to-purple-800 transition-all duration-300"
          >
            Nuevo Usuario
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-4 py-2 rounded-lg shadow-md hover:from-gray-600 hover:to-gray-800 transition-all duration-300"
          >
            Volver al Inicio
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Rol</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="text-gray-700 hover:bg-gray-100">
                <td className="px-4 py-2 border">{u.nombre}</td>
                <td className="px-4 py-2 border">{u.email}</td>
                <td className="px-4 py-2 border">{u.rol}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => abrirFormularioUsuario(u)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarUsuario(u.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
