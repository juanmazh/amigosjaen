import { useContext, useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import AuthContext from "../../context/AuthContext";
import api from "../../api";
import Swal from "sweetalert2";

const inputClass = "w-full px-4 py-2.5 rounded-lg border border-crema-300 bg-crema-50 focus:bg-white focus:border-jaen-400 focus:ring-2 focus:ring-jaen-200 outline-none transition-all";

function CrearPublicacion({ onPublicacionCreada }) {
  const { usuario } = useContext(AuthContext);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [etiquetas, setEtiquetas] = useState([]);
  const [etiquetaActual, setEtiquetaActual] = useState("");
  const [etiquetasExistentes, setEtiquetasExistentes] = useState([]);

  useEffect(() => {
    api.get("/etiquetas")
      .then(res => setEtiquetasExistentes(res.data.map(e => e.nombre)))
      .catch(() => {});
  }, []);

  const sugerencias = etiquetaActual
    ? etiquetasExistentes.filter(et => !etiquetas.includes(et) && et.toLowerCase().includes(etiquetaActual.toLowerCase()))
    : [];

  const addEtiqueta = (et) => {
    if (et && !etiquetas.includes(et)) setEtiquetas([...etiquetas, et]);
    setEtiquetaActual("");
  };

  const handleEtiquetaKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && etiquetaActual.trim() !== "") {
      e.preventDefault();
      addEtiqueta(etiquetaActual.trim());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !contenido) return Swal.fire("Error", "Todos los campos son obligatorios", "error");
    try {
      const res = await api.post("/publicaciones", {
        titulo,
        contenido,
        etiquetas: etiquetas.map(et => et.trim()),
        usuarioId: usuario.id,
      });
      Swal.fire("¡Publicado!", "Tu publicación se ha creado con éxito", "success");
      setTitulo(""); setContenido(""); setEtiquetas([]);
      if (onPublicacionCreada) onPublicacionCreada(res.data);
    } catch {
      Swal.fire("Error", "No se pudo crear la publicación", "error");
    }
  };

  if (!usuario) return null;

  return (
    <div className="bg-white border border-crema-300 rounded-2xl p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-piedra-700 mb-1.5">Título</label>
          <input type="text" className={inputClass} value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-piedra-700 mb-1.5">Contenido</label>
          <textarea className={inputClass} rows="6" value={contenido} onChange={(e) => setContenido(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-piedra-700 mb-1.5">Etiquetas</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {etiquetas.map((et, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-jaen-50 text-jaen-600 px-3 py-1 rounded-full text-sm">
                #{et}
                <button type="button" onClick={() => setEtiquetas(etiquetas.filter((_, j) => j !== i))} className="hover:text-jaen-800">
                  <FaTimes className="text-xs" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Escribe y pulsa Enter…"
            className={inputClass}
            value={etiquetaActual}
            onChange={e => setEtiquetaActual(e.target.value)}
            onKeyDown={handleEtiquetaKeyDown}
            autoComplete="off"
          />
          {sugerencias.length > 0 && (
            <div className="mt-2 border border-crema-300 rounded-lg bg-white shadow-sm max-h-40 overflow-y-auto">
              {sugerencias.map((et, idx) => (
                <button
                  type="button"
                  key={idx}
                  className="w-full text-left px-4 py-2 hover:bg-jaen-50 text-piedra-700 hover:text-jaen-600 text-sm transition-colors"
                  onMouseDown={() => addEtiqueta(et)}
                >
                  #{et}
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="w-full py-3 rounded-full bg-jaen-500 text-white font-medium hover:bg-jaen-600 shadow-sm hover:shadow transition-all">
          Publicar
        </button>
      </form>
    </div>
  );
}

export default CrearPublicacion;
