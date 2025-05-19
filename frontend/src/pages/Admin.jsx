import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AuthContext from "../context/AuthContext";
import api from "../api";
import AdminUsuarios from "./components/AdminUsuarios";
import AdminPublicaciones from "./components/AdminPublicaciones";
import AdminEventos from "./components/AdminEventos";

const MySwal = withReactContent(Swal);

function Admin() {
  const { usuario, cargando } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [asistentesEventos, setAsistentesEventos] = useState({});

  useEffect(() => {
    if (cargando) return;
    if (!usuario || usuario.rol !== "admin") {
      navigate("/login");
    } else {
      cargarUsuarios();
      cargarPublicaciones();
      cargarEventos();
    }
  }, [usuario, cargando, navigate]);

  useEffect(() => {
    if (eventos.length > 0) {
      eventos.forEach((evento) => {
        api
          .get(`/eventos/${evento.id}/asistentes`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
          .then((res) => {
            setAsistentesEventos((prev) => ({ ...prev, [evento.id]: res.data }));
          })
          .catch(() => {});
      });
    }
  }, [eventos]);

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

  const cargarPublicaciones = () => {
    api
      .get("/publicaciones", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setPublicaciones(res.data))
      .catch(() =>
        Swal.fire("Error", "No se pudieron cargar las publicaciones", "error")
      );
  };

  const cargarEventos = () => {
    api
      .get("/eventos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setEventos(res.data))
      .catch(() =>
        Swal.fire("Error", "No se pudieron cargar los eventos", "error")
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

  const eliminarPublicacion = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar publicación?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (confirmacion.isConfirmed) {
      try {
        await api.delete(`/publicaciones/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPublicaciones((prev) => prev.filter((p) => p.id !== id));
        Swal.fire("Eliminado", "Publicación eliminada correctamente", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la publicación", "error");
      }
    }
  };

  const eliminarEvento = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar evento?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (confirmacion.isConfirmed) {
      try {
        await api.delete(`/eventos/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEventos((prev) => prev.filter((e) => e.id !== id));
        Swal.fire("Eliminado", "Evento eliminado correctamente", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el evento", "error");
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

  const abrirFormularioPublicacion = (publicacionInicial = null) => {
    MySwal.fire({
      title: publicacionInicial ? "Editar Publicación" : "Nueva Publicación",
      html: (
        <div className="flex flex-col space-y-3">
          <input
            id="swal-titulo"
            className="swal2-input"
            defaultValue={publicacionInicial?.titulo || ""}
            placeholder="Título"
          />
          <textarea
            id="swal-contenido"
            className="swal2-textarea"
            defaultValue={publicacionInicial?.contenido || ""}
            placeholder="Contenido"
          />
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: publicacionInicial ? "Actualizar" : "Crear",
      preConfirm: () => {
        const titulo = document.getElementById("swal-titulo").value;
        const contenido = document.getElementById("swal-contenido").value;
        if (!titulo || !contenido) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
        }
        return { titulo, contenido };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const datos = result.value;
        try {
          if (publicacionInicial) {
            const res = await api.put(`/publicaciones/${publicacionInicial.id}`, datos, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setPublicaciones((prev) =>
              prev.map((p) => (p.id === publicacionInicial.id ? res.data.publicacion : p))
            );
            Swal.fire("Actualizado", "Publicación actualizada correctamente", "success");
          } else {
            const res = await api.post(`/publicaciones`, datos, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setPublicaciones((prev) => [...prev, res.data.publicacion]);
            Swal.fire("Creado", "Publicación creada correctamente", "success");
          }
        } catch (error) {
          Swal.fire("Error", "No se pudo guardar la publicación", "error");
        }
      }
    });
  };

  const abrirFormularioEvento = (eventoInicial = null) => {
    MySwal.fire({
      title: eventoInicial ? "Editar Evento" : "Nuevo Evento",
      html: (
        <div className="flex flex-col space-y-3">
          <input
            id="swal-titulo-evento"
            className="swal2-input"
            defaultValue={eventoInicial?.titulo || ""}
            placeholder="Título"
          />
          <textarea
            id="swal-descripcion-evento"
            className="swal2-textarea"
            defaultValue={eventoInicial?.descripcion || ""}
            placeholder="Descripción"
          />
          <input
            id="swal-fecha-evento"
            className="swal2-input"
            type="date"
            defaultValue={eventoInicial?.fecha ? eventoInicial.fecha.slice(0,10) : ""}
            placeholder="Fecha"
          />
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: eventoInicial ? "Actualizar" : "Crear",
      preConfirm: () => {
        const titulo = document.getElementById("swal-titulo-evento").value;
        const descripcion = document.getElementById("swal-descripcion-evento").value;
        const fecha = document.getElementById("swal-fecha-evento").value;
        if (!titulo || !descripcion || !fecha) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
        }
        return { titulo, descripcion, fecha };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const datos = result.value;
        try {
          if (eventoInicial) {
            const res = await api.put(`/eventos/${eventoInicial.id}`, datos, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setEventos((prev) =>
              prev.map((e) => (e.id === eventoInicial.id ? res.data.evento : e))
            );
            Swal.fire("Actualizado", "Evento actualizado correctamente", "success");
          } else {
            const res = await api.post(`/eventos`, datos, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setEventos((prev) => [...prev, res.data.evento]);
            Swal.fire("Creado", "Evento creado correctamente", "success");
          }
        } catch (error) {
          Swal.fire("Error", "No se pudo guardar el evento", "error");
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6 flex justify-between items-center">
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
      <AdminUsuarios
        usuarios={usuarios}
        abrirFormularioUsuario={abrirFormularioUsuario}
        eliminarUsuario={eliminarUsuario}
      />
      <AdminPublicaciones
        publicaciones={publicaciones}
        abrirFormularioPublicacion={abrirFormularioPublicacion}
        eliminarPublicacion={eliminarPublicacion}
      />
      <AdminEventos
        eventos={eventos}
        asistentesEventos={asistentesEventos}
        abrirFormularioEvento={abrirFormularioEvento}
        eliminarEvento={eliminarEvento}
        MySwal={MySwal}
      />
    </div>
  );
}

export default Admin;
