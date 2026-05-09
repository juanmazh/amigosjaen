import { useState, useEffect } from "react";
import api from "../../api";
import Swal from "sweetalert2";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaTimes } from "react-icons/fa";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapSelector({ onLocationSelect }) {
  useMapEvents({
    click: (e) => onLocationSelect(e.latlng),
  });
  return null;
}

const inputClass = "w-full px-4 py-2.5 rounded-lg border border-crema-300 bg-crema-50 focus:bg-white focus:border-jaen-400 focus:ring-2 focus:ring-jaen-200 outline-none transition-all";

function CrearEvento({ onEventoCreado }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [imagenLinks, setImagenLinks] = useState([""]);
  const [localizacion, setLocalizacion] = useState({ lat: 37.7796, lng: -3.7849 });
  const [direccionTexto, setDireccionTexto] = useState("");
  const [etiquetas, setEtiquetas] = useState([]);
  const [etiquetaActual, setEtiquetaActual] = useState("");
  const [etiquetasExistentes, setEtiquetasExistentes] = useState([]);
  const navigate = useNavigate();

  const isValidLatLng = (latlng) => latlng && typeof latlng.lat === "number" && typeof latlng.lng === "number";

  const handleImagenLinkChange = (index, value) => {
    const newLinks = [...imagenLinks];
    newLinks[index] = value;
    setImagenLinks(newLinks);
  };

  const handleGeocode = async () => {
    if (!direccionTexto.trim()) return Swal.fire("Error", "Introduce una dirección", "error");
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: direccionTexto, format: "json", addressdetails: 1 },
      });
      if (res.data.length > 0) {
        const { lat, lon } = res.data[0];
        setLocalizacion({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        Swal.fire("Sin resultados", "No se encontró la dirección", "info");
      }
    } catch {
      Swal.fire("Error", "No se pudo procesar la dirección", "error");
    }
  };

  const handleEtiquetaKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && etiquetaActual.trim() !== "") {
      e.preventDefault();
      if (!etiquetas.includes(etiquetaActual.trim())) {
        setEtiquetas([...etiquetas, etiquetaActual.trim()]);
      }
      setEtiquetaActual("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) return Swal.fire("Error", "Inicia sesión", "error");
    if (!titulo || !descripcion || !fecha || !hora) return Swal.fire("Error", "Completa todos los campos obligatorios", "error");

    const fechaHora = new Date(`${fecha}T${hora}`).toISOString().slice(0, 16);
    const formData = {
      titulo,
      descripcion,
      fecha: fechaHora,
      imagenes: JSON.stringify(imagenLinks.filter((l) => l.trim() !== "")),
      localizacion: typeof localizacion === 'object' ? `${localizacion.lat},${localizacion.lng}` : localizacion,
      etiquetas,
    };

    try {
      const res = await api.post("/eventos", formData);
      Swal.fire("¡Evento creado!", "Tu evento se ha creado con éxito", "success");
      if (onEventoCreado) onEventoCreado(res.data);
      setTimeout(() => navigate("/eventos"), 1200);
    } catch {
      Swal.fire("Error", "No se pudo crear el evento", "error");
    }
  };

  useEffect(() => {
    api.get("/etiquetas")
      .then((res) => setEtiquetasExistentes(res.data.map((e) => e.nombre)))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white border border-crema-300 rounded-2xl p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-piedra-700 mb-1.5">Título</label>
          <input type="text" className={inputClass} value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-piedra-700 mb-1.5">Descripción</label>
          <textarea className={inputClass} rows="4" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-piedra-700 mb-1.5">Fecha</label>
            <input type="date" className={inputClass} value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-piedra-700 mb-1.5">Hora</label>
            <input type="time" className={inputClass} value={hora} onChange={(e) => setHora(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-piedra-700 mb-1.5">Localización</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Dirección (ej. Plaza Santa María, Jaén)"
              className={inputClass}
              value={direccionTexto}
              onChange={(e) => setDireccionTexto(e.target.value)}
            />
            <button
              type="button"
              onClick={handleGeocode}
              className="px-4 py-2.5 rounded-lg bg-jaen-500 text-white hover:bg-jaen-600 transition-colors flex items-center gap-2 shrink-0"
            >
              <FaSearch /> Buscar
            </button>
          </div>
          <p className="text-xs text-piedra-500 mt-1.5">O haz clic en el mapa para seleccionar el punto exacto.</p>
        </div>

        <div className="w-full h-64 rounded-2xl overflow-hidden border border-crema-300">
          <MapContainer center={[37.7796, -3.7849]} zoom={13} className="h-full w-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />
            {isValidLatLng(localizacion) && <Marker position={localizacion} icon={customIcon} />}
            <MapSelector onLocationSelect={(latlng) => setLocalizacion(latlng)} />
          </MapContainer>
        </div>

        <div>
          <label className="block text-sm font-medium text-piedra-700 mb-1.5">Imágenes (URLs)</label>
          <div className="space-y-2">
            {imagenLinks.map((link, index) => (
              <input
                key={index}
                type="text"
                placeholder="https://…"
                className={inputClass}
                value={link}
                onChange={(e) => handleImagenLinkChange(index, e.target.value)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setImagenLinks([...imagenLinks, ""])}
            className="mt-2 inline-flex items-center gap-2 text-sm text-jaen-600 hover:text-jaen-700 font-medium"
          >
            <FaPlus className="text-xs" /> Añadir otra imagen
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-piedra-700 mb-1.5">Etiquetas</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {etiquetas.map((etiqueta, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-jaen-50 text-jaen-600 px-3 py-1 rounded-full text-sm">
                #{etiqueta}
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
            onChange={(e) => setEtiquetaActual(e.target.value)}
            onKeyDown={handleEtiquetaKeyDown}
            list="etiquetas-sugeridas"
          />
          <datalist id="etiquetas-sugeridas">
            {etiquetasExistentes.map((et, i) => <option key={i} value={et} />)}
          </datalist>
        </div>

        <button type="submit" className="w-full py-3 rounded-full bg-jaen-500 text-white font-medium hover:bg-jaen-600 shadow-sm hover:shadow transition-all">
          Crear evento
        </button>
      </form>
    </div>
  );
}

export default CrearEvento;
