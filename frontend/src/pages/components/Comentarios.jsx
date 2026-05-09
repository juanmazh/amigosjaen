import { useState, useContext, useEffect } from "react";
import { FaReply, FaPaperPlane } from "react-icons/fa";
import api from "../../api";
import AuthContext from "../../context/AuthContext";

const inputClass = "flex-1 px-4 py-2 rounded-lg border border-crema-300 bg-crema-50 focus:bg-white focus:border-jaen-400 focus:ring-2 focus:ring-jaen-200 outline-none transition-all text-sm";

function Comentarios({ publicacionId, onNuevoComentario }) {
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [respondiendoA, setRespondiendoA] = useState(null);
  const [respuesta, setRespuesta] = useState("");
  const { usuario } = useContext(AuthContext);

  useEffect(() => {
    api.get(`/comentarios/publicacion/${publicacionId}`)
      .then(res => setComentarios(res.data))
      .finally(() => setCargando(false));
  }, [publicacionId, onNuevoComentario]);

  const handleEnviar = async () => {
    if (!nuevoComentario.trim()) return;
    await api.post("/comentarios", { contenido: nuevoComentario, publicacionId, parentId: null });
    setNuevoComentario("");
    if (onNuevoComentario) onNuevoComentario();
  };

  const handleEnviarRespuesta = async (parentId) => {
    if (!respuesta.trim()) return;
    await api.post("/comentarios", { contenido: respuesta, publicacionId, parentId });
    setRespuesta("");
    setRespondiendoA(null);
    if (onNuevoComentario) onNuevoComentario();
  };

  const renderComentarios = (lista, nivel = 0) => (
    <ul className={nivel === 0 ? "space-y-3" : "ml-5 mt-3 space-y-3 border-l-2 border-jaen-100 pl-4"}>
      {lista.map(com => (
        <li key={com.id}>
          <div className="bg-crema-50 border border-crema-200 rounded-xl p-3.5">
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className="font-medium text-jaen-600 text-sm">{com.Usuario?.nombre || "Usuario"}</span>
              {usuario && (
                <button
                  className="text-xs text-piedra-500 hover:text-jaen-600 inline-flex items-center gap-1 transition-colors"
                  onClick={() => setRespondiendoA(com.id)}
                >
                  <FaReply /> Responder
                </button>
              )}
            </div>
            <p className="text-piedra-700 text-sm leading-relaxed">{com.contenido}</p>
          </div>
          {respondiendoA === com.id && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                className={inputClass}
                placeholder="Escribe una respuesta…"
                value={respuesta}
                onChange={e => setRespuesta(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => handleEnviarRespuesta(com.id)}
                className="px-4 rounded-lg bg-jaen-500 text-white hover:bg-jaen-600 transition-colors"
              >
                <FaPaperPlane />
              </button>
              <button
                onClick={() => { setRespondiendoA(null); setRespuesta(""); }}
                className="px-3 text-sm text-piedra-500 hover:text-piedra-700"
              >
                Cancelar
              </button>
            </div>
          )}
          {com.respuestas?.length > 0 && renderComentarios(com.respuestas, nivel + 1)}
        </li>
      ))}
    </ul>
  );

  if (cargando) return <p className="text-piedra-500 text-sm">Cargando comentarios…</p>;

  return (
    <div>
      {comentarios.length === 0 ? (
        <p className="text-piedra-500 text-sm italic">Aún no hay comentarios. ¡Sé el primero!</p>
      ) : renderComentarios(comentarios)}

      {usuario && (
        <div className="mt-5 pt-5 border-t border-crema-200 flex gap-2">
          <input
            type="text"
            className={inputClass}
            placeholder="Escribe un comentario…"
            value={nuevoComentario}
            onChange={e => setNuevoComentario(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEnviar()}
          />
          <button
            onClick={handleEnviar}
            className="px-5 rounded-lg bg-jaen-500 text-white hover:bg-jaen-600 transition-colors flex items-center gap-2"
          >
            <FaPaperPlane className="text-sm" />
            <span className="hidden sm:inline text-sm">Comentar</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Comentarios;
