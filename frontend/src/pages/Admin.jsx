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
        const rol = document.getElementById("swal-rol").value;

        if (!nombre || !email || !rol) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
        }

        return { nombre, email, rol };
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

  const mostrarFormularioNuevoUsuario = async () => {
    const { value: formValues } = await MySwal.fire({
      title: 'Crear nuevo usuario',
      html:
        `<input id="swal-input-nombre" class="swal2-input" placeholder="Nombre">` +
        `<input id="swal-input-email" class="swal2-input" placeholder="Email">` +
        `<input id="swal-input-password" type="password" class="swal2-input" placeholder="Contraseña">` +
        `<select id="swal-input-rol" class="swal2-select">
          <option value="cliente">Cliente</option>
          <option value="admin">Administrador</option>
        </select>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Crear',
      preConfirm: () => {
        const nombre = document.getElementById('swal-input-nombre').value;
        const email = document.getElementById('swal-input-email').value;
        const password = document.getElementById('swal-input-password').value;
        const rol = document.getElementById('swal-input-rol').value;
  
        if (!nombre || !email || !password) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return;
        }
        return { nombre, email, password, rol };
      }
    });
  
    if (formValues) {
      try {
        const res = await api.post('/auth/register', formValues);
        setUsuarios([...usuarios, res.data.usuario]);
        Swal.fire('Usuario creado', '', 'success');
      } catch (error) {
        console.error('Error al crear usuario', error);
        Swal.fire('Error', 'No se pudo crear el usuario', 'error');
      }
    }
  };
  

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        <button
         onClick={mostrarFormularioNuevoUsuario}
         className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded mb-4"
            >
        Nuevo Usuario
        </button>
      </div>
      <ul className="space-y-2 mt-4">
        {usuarios.map((u) => (
          <li key={u.id} className="flex justify-between items-center border-b p-2">
            <span>
              {u.nombre} - {u.email} - {u.rol}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => abrirFormularioUsuario(u)}
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
    </div>
  );
}

export default Admin;
