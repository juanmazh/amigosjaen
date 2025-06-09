import { useState, useContext, useEffect } from "react";
import api from "../../api";
import AuthContext from "../../context/AuthContext";
import { FaReply, FaComment } from "react-icons/fa";
//componente de /publicaciones/:id
function Comentarios({ publicacionId, onNuevoComentario }) {
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [respondiendoA, setRespondiendoA] = useState(null);
  const [respuesta, setRespuesta] = useState("");
  const { usuario } = useContext(AuthContext);

  // Cargar comentarios al montar
  useEffect(() => {
    api.get(`/comentarios/publicacion/${publicacionId}`)
      .then(res => setComentarios(res.data))
      .finally(() => setCargando(false));
  }, [publicacionId, onNuevoComentario]);

  // Enviar nuevo comentario
  const handleEnviar = async (parentId = null) => {
    if (!nuevoComentario.trim()) return;
    await api.post("/comentarios", {
      contenido: nuevoComentario,
      publicacionId,
      parentId,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setNuevoComentario("");
    if (onNuevoComentario) onNuevoComentario();
  };

  // Enviar respuesta a un comentario específico
  const handleEnviarRespuesta = async (parentId) => {
    if (!respuesta.trim()) return;
    await api.post("/comentarios", {
      contenido: respuesta,
      publicacionId,
      parentId,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setRespuesta("");
    setRespondiendoA(null);
    if (onNuevoComentario) onNuevoComentario();
  };

  // Renderizar comentarios y respuestas
  const renderComentarios = (comentarios, nivel = 0) => (
    <ul className={nivel === 0 ? "space-y-2" : "ml-6 border-l-2 pl-4 border-purple-200"}>
      {comentarios.map(com => (
        <li key={com.id} className="mb-2">
          <div className="bg-white rounded shadow p-2">
            <span className="font-semibold text-purple-700">{com.Usuario?.nombre || "Usuario"}</span>
            <span className="ml-2 text-gray-700">{com.contenido}</span>
            {usuario && (
              <button
                className="ml-4 text-xs text-blue-600 hover:underline flex items-center gap-1"
                onClick={() => setRespondiendoA(com.id)}
                title="Responder"
              >
                <FaReply />
              </button>
            )}
          </div>
          {respondiendoA === com.id && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                className="flex-1 border rounded px-2 py-1"
                placeholder="Escribe una respuesta..."
                value={respuesta}
                onChange={e => setRespuesta(e.target.value)}
              />
              <button
                className="bg-purple-500 text-white px-2 py-1 rounded"
                onClick={() => handleEnviarRespuesta(com.id)}
              >
                Enviar
              </button>
              <button
                className="text-gray-500 px-2 py-1"
                onClick={() => { setRespondiendoA(null); setRespuesta(""); }}
              >
                Cancelar
              </button>
            </div>
          )}
          {com.respuestas && com.respuestas.length > 0 && renderComentarios(com.respuestas, nivel + 1)}
        </li>
      ))}
    </ul>
  );

  if (cargando) return <p>Cargando comentarios...</p>;

  return (
    <div>
      {comentarios.length === 0 ? (
        <p className="text-gray-500">Aún no hay comentarios. ¡Sé el primero en comentar!</p>
      ) : renderComentarios(comentarios)}
      {usuario && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-2 py-1"
            placeholder="Escribe un comentario..."
            value={nuevoComentario}
            onChange={e => setNuevoComentario(e.target.value)}
          />
          <button
            className="bg-purple-600 text-white px-3 py-1 rounded flex items-center gap-1"
            onClick={() => handleEnviar()}
          >
            <span className="hidden sm:inline">Comentar</span>
            <FaComment className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Comentarios;
