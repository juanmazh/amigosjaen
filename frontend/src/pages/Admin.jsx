import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AuthContext from "../context/AuthContext";
import api from "../api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminUsuarios from "./components/AdminUsuarios";
import AdminPublicaciones from "./components/AdminPublicaciones";
import AdminEventos from "./components/AdminEventos";

const MySwal = withReactContent(Swal);

function Admin() {
  const { usuario, cargando } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState("usuarios");
  const [usuarios, setUsuarios] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [asistentesEventos, setAsistentesEventos] = useState({});

  useEffect(() => {
    if (cargando) return;
    if (!usuario || usuario.rol !== "admin") { navigate("/login"); return; }
    cargarUsuarios(); cargarPublicaciones(); cargarEventos();
  }, [usuario, cargando, navigate]);

  useEffect(() => {
    if (eventos.length > 0) {
      eventos.forEach((evento) => {
        api.get(`/eventos/${evento.id}/asistentes`)
          .then((res) => setAsistentesEventos((prev) => ({ ...prev, [evento.id]: res.data })))
          .catch(() => {});
      });
    }
  }, [eventos]);

  const errorMsg = (e, fallback) => `${fallback}\n[${e.response?.status || '?'}] ${e.response?.data?.msg || e.response?.data?.mensaje || e.message}`;
  const cargarUsuarios = () => api.get("/usuarios").then((res) => setUsuarios(res.data.usuario || res.data)).catch((e) => Swal.fire("Error", errorMsg(e, "No se pudieron cargar los usuarios"), "error"));
  const cargarPublicaciones = () => api.get("/publicaciones").then((res) => setPublicaciones(res.data.publicacion || res.data)).catch((e) => Swal.fire("Error", errorMsg(e, "No se pudieron cargar las publicaciones"), "error"));
  const cargarEventos = () => api.get("/eventos").then((res) => setEventos(res.data.evento || res.data)).catch((e) => Swal.fire("Error", errorMsg(e, "No se pudieron cargar los eventos"), "error"));

  const eliminar = async (tipo, id, endpoint, setter) => {
    const res = await Swal.fire({ title: `¿Eliminar ${tipo}?`, text: "Esta acción no se puede deshacer.", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar" });
    if (res.isConfirmed) {
      try {
        await api.delete(`${endpoint}/${id}`);
        setter((prev) => prev.filter((x) => x.id !== id));
        Swal.fire("Eliminado", "Eliminado correctamente", "success");
      } catch {
        Swal.fire("Error", `No se pudo eliminar el ${tipo}`, "error");
      }
    }
  };

  const eliminarUsuario = (id) => eliminar("usuario", id, "/usuarios", setUsuarios);
  const eliminarPublicacion = (id) => eliminar("publicación", id, "/publicaciones", setPublicaciones);
  const eliminarEvento = (id) => eliminar("evento", id, "/eventos", setEventos);

  const abrirFormularioUsuario = (usuarioInicial = null) => {
    MySwal.fire({
      title: usuarioInicial ? "Editar usuario" : "Nuevo usuario",
      html: (
        <div className="flex flex-col space-y-3">
          <input id="swal-nombre" className="swal2-input" defaultValue={usuarioInicial?.nombre || ""} placeholder="Nombre" />
          <input id="swal-email" className="swal2-input" type="email" defaultValue={usuarioInicial?.email || ""} placeholder="Email" />
          <input id="swal-password" className="swal2-input" type="password" placeholder="Contraseña" />
          <select id="swal-rol" className="swal2-select" defaultValue={usuarioInicial?.rol || "usuario"}>
            <option value="usuario">Usuario</option>
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
        if (!nombre || !email || (!usuarioInicial && !password) || !rol) Swal.showValidationMessage("Todos los campos son obligatorios");
        return { nombre, email, password, rol };
      },
    }).then(async (result) => {
      if (!result.isConfirmed || !result.value) return;
      try {
        if (usuarioInicial) {
          const res = await api.put(`/usuarios/${usuarioInicial.id}`, result.value);
          setUsuarios((prev) => prev.map((u) => (u.id === usuarioInicial.id ? res.data.usuario : u)));
          Swal.fire("Actualizado", "Usuario actualizado", "success");
        } else {
          const res = await api.post(`/usuarios`, result.value);
          setUsuarios((prev) => [...prev, res.data.usuario]);
          Swal.fire("Creado", "Usuario creado", "success");
        }
      } catch { Swal.fire("Error", "No se pudo guardar", "error"); }
    });
  };

  const abrirFormularioPublicacion = (publicacionInicial = null) => {
    MySwal.fire({
      title: publicacionInicial ? "Editar publicación" : "Nueva publicación",
      html: (
        <div className="flex flex-col space-y-3">
          <input id="swal-titulo" className="swal2-input" defaultValue={publicacionInicial?.titulo || ""} placeholder="Título" />
          <textarea id="swal-contenido" className="swal2-textarea" defaultValue={publicacionInicial?.contenido || ""} placeholder="Contenido" />
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: publicacionInicial ? "Actualizar" : "Crear",
      preConfirm: () => {
        const titulo = document.getElementById("swal-titulo").value;
        const contenido = document.getElementById("swal-contenido").value;
        if (!titulo || !contenido) Swal.showValidationMessage("Todos los campos son obligatorios");
        return { titulo, contenido };
      },
    }).then(async (result) => {
      if (!result.isConfirmed || !result.value) return;
      try {
        if (publicacionInicial) {
          const res = await api.put(`/publicaciones/${publicacionInicial.id}`, result.value);
          const nueva = res.data.publicacion || res.data;
          setPublicaciones((prev) => prev.map((p) => (p.id === publicacionInicial.id ? nueva : p)));
          Swal.fire("Actualizado", "Publicación actualizada", "success");
        } else {
          const res = await api.post(`/publicaciones`, result.value);
          const nueva = res.data.publicacion || res.data;
          setPublicaciones((prev) => [...prev, nueva]);
          Swal.fire("Creado", "Publicación creada", "success");
        }
      } catch { Swal.fire("Error", "No se pudo guardar", "error"); }
    });
  };

  const abrirFormularioEvento = (eventoInicial = null) => {
    MySwal.fire({
      title: eventoInicial ? "Editar evento" : "Nuevo evento",
      html: (
        <div className="flex flex-col space-y-3">
          <input id="swal-titulo-evento" className="swal2-input" defaultValue={eventoInicial?.titulo || ""} placeholder="Título" />
          <textarea id="swal-descripcion-evento" className="swal2-textarea" defaultValue={eventoInicial?.descripcion || ""} placeholder="Descripción" />
          <input id="swal-fecha-evento" className="swal2-input" type="date" defaultValue={eventoInicial?.fecha ? eventoInicial.fecha.slice(0, 10) : ""} />
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: eventoInicial ? "Actualizar" : "Crear",
      preConfirm: () => {
        const titulo = document.getElementById("swal-titulo-evento").value;
        const descripcion = document.getElementById("swal-descripcion-evento").value;
        const fecha = document.getElementById("swal-fecha-evento").value;
        if (!titulo || !descripcion || !fecha) Swal.showValidationMessage("Todos los campos son obligatorios");
        return { titulo, descripcion, fecha };
      },
    }).then(async (result) => {
      if (!result.isConfirmed || !result.value) return;
      try {
        if (eventoInicial) {
          const res = await api.put(`/eventos/${eventoInicial.id}`, result.value);
          const nuevo = res.data.evento || res.data;
          setEventos((prev) => prev.map((e) => (e.id === eventoInicial.id ? nuevo : e)));
          Swal.fire("Actualizado", "Evento actualizado", "success");
        } else {
          const res = await api.post(`/eventos`, result.value);
          const nuevo = res.data.evento || res.data;
          setEventos((prev) => [...prev, nuevo]);
          Swal.fire("Creado", "Evento creado", "success");
        }
      } catch { Swal.fire("Error", "No se pudo guardar", "error"); }
    });
  };

  const tabs = [
    { id: "usuarios", label: "Usuarios", count: usuarios.length },
    { id: "publicaciones", label: "Publicaciones", count: publicaciones.length },
    { id: "eventos", label: "Eventos", count: eventos.length },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-crema-100">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-block text-xs uppercase tracking-[0.2em] text-jaen-500 font-semibold mb-2">Panel de control</span>
            <h1 className="font-display text-5xl text-jaen-700 font-semibold">Admin</h1>
          </div>
          <button
            onClick={() => {
              if (tab === "usuarios") abrirFormularioUsuario();
              else if (tab === "publicaciones") abrirFormularioPublicacion();
              else abrirFormularioEvento();
            }}
            className="px-5 py-2.5 rounded-full bg-jaen-500 text-white font-medium hover:bg-jaen-600 shadow-sm hover:shadow-md transition-all"
          >
            Nuevo {tab.slice(0, -1)}
          </button>
        </div>

        <div className="border-b border-crema-300 mb-6 flex gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t.id ? 'text-jaen-600 border-jaen-500' : 'text-piedra-500 border-transparent hover:text-piedra-700'
              }`}
            >
              {t.label} <span className="ml-1.5 text-xs opacity-70">({t.count})</span>
            </button>
          ))}
        </div>

        {tab === "usuarios" && (
          <AdminUsuarios usuarios={usuarios} abrirFormularioUsuario={abrirFormularioUsuario} eliminarUsuario={eliminarUsuario} />
        )}
        {tab === "publicaciones" && (
          <AdminPublicaciones publicaciones={publicaciones} abrirFormularioPublicacion={abrirFormularioPublicacion} eliminarPublicacion={eliminarPublicacion} />
        )}
        {tab === "eventos" && (
          <AdminEventos eventos={eventos} asistentesEventos={asistentesEventos} abrirFormularioEvento={abrirFormularioEvento} eliminarEvento={eliminarEvento} MySwal={MySwal} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Admin;
