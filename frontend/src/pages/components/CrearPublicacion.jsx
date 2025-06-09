import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import api from "../../api";
import Swal from "sweetalert2";
//componente de /crear-publicacion
function CrearPublicacion({ onPublicacionCreada }) {
  const { usuario } = useContext(AuthContext);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [etiquetas, setEtiquetas] = useState([]);
  const [etiquetaActual, setEtiquetaActual] = useState("");
  const [etiquetasExistentes, setEtiquetasExistentes] = useState([]);

  useEffect(() => {
    // Cargar etiquetas existentes desde el backend
    const cargarEtiquetas = async () => {
      try {
        const res = await api.get("/etiquetas");
        setEtiquetasExistentes(res.data.map((etiqueta) => etiqueta.nombre));
      } catch (err) {
        console.error("Error al cargar etiquetas:", err);
      }
    };
    cargarEtiquetas();
  }, []);

  const handleEtiquetaKeyDown = (e) => {
    if (e.key === " " && etiquetaActual.trim() !== "") {
      e.preventDefault();
      setEtiquetas([...etiquetas, etiquetaActual.trim()]);
      setEtiquetaActual("");
    }
  };

  const handleEliminarEtiqueta = (index) => {
    setEtiquetas(etiquetas.filter((_, i) => i !== index));
  };

  const handleSeleccionarEtiqueta = (e) => {
    const seleccionadas = Array.from(e.target.selectedOptions, (option) => option.value);
    setEtiquetas([...new Set([...etiquetas, ...seleccionadas])]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !contenido) {
      return Swal.fire("Error", "Todos los campos son obligatorios", "error");
    }

    try {
      const res = await api.post("/publicaciones", {
        titulo,
        contenido,
        etiquetas: etiquetas.map((etiqueta) => etiqueta.trim()), // Enviar etiquetas como array de strings
        usuarioId: usuario.id,
      });

      Swal.fire("¡Publicado!", "Tu publicación se ha creado con éxito", "success");
      setTitulo("");
      setContenido("");
      setEtiquetas([]);
      if (onPublicacionCreada) onPublicacionCreada(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo crear la publicación", "error");
    }
  };

  if (!usuario) return null; // No mostrar si no está logueado

  return (
    <div className="mb-6 bg-white shadow p-4 rounded-xl">
      <h2 className="text-xl font-bold mb-2 text-purple-600">Crear nueva publicación</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <textarea
          placeholder="Contenido..."
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows="4"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Etiquetas</label>
          {/* Chips de etiquetas seleccionadas */}
          <div className="flex flex-wrap gap-2 mb-2">
            {etiquetas.map((etiqueta, index) => (
              <span
                key={index}
                className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {etiqueta}
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleEliminarEtiqueta(index)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          {/* Input para añadir etiquetas con sugerencias */}
          <input
            type="text"
            placeholder="Añade una etiqueta y pulsa Enter"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={etiquetaActual}
            onChange={e => setEtiquetaActual(e.target.value)}
            onKeyDown={e => {
              if ((e.key === 'Enter' || e.key === ',') && etiquetaActual.trim() !== '') {
                e.preventDefault();
                const nueva = etiquetaActual.trim();
                if (!etiquetas.includes(nueva)) {
                  setEtiquetas([...etiquetas, nueva]);
                }
                setEtiquetaActual('');
              }
            }}
            list="etiquetas-sugeridas"
            autoComplete="off"
          />
          {/* Sugerencias de etiquetas existentes (datalist nativo) */}
          <datalist id="etiquetas-sugeridas">
            {etiquetasExistentes
              .filter(etq => !etiquetas.includes(etq) && etq.toLowerCase().includes(etiquetaActual.toLowerCase()))
              .map((etq, idx) => (
                <option key={idx} value={etq} />
              ))}
          </datalist>
          <p className="text-xs text-gray-500">Sugerencias: empieza a escribir y selecciona con Enter o haz clic en una sugerencia.</p>
          {/* Sugerencias personalizadas tipo dropdown (mejor UX que datalist nativo) */}
          {etiquetaActual && etiquetasExistentes.filter(etq => !etiquetas.includes(etq) && etq.toLowerCase().includes(etiquetaActual.toLowerCase())).length > 0 && (
            <div className="border border-gray-200 rounded bg-white shadow p-2 mt-1 max-h-32 overflow-y-auto z-10">
              {etiquetasExistentes
                .filter(etq => !etiquetas.includes(etq) && etq.toLowerCase().includes(etiquetaActual.toLowerCase()))
                .map((etq, idx) => (
                  <div
                    key={idx}
                    className="cursor-pointer px-2 py-1 hover:bg-purple-100 rounded"
                    onMouseDown={() => {
                      setEtiquetas([...etiquetas, etq]);
                      setEtiquetaActual('');
                    }}
                  >
                    {etq}
                  </div>
                ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Publicar
        </button>
      </form>
    </div>
  );
}

export default CrearPublicacion;
