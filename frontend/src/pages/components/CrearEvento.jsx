import { useState, useEffect } from "react";
import api from "../../api";
import Swal from "sweetalert2";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//componente de /crear-evento
// Configuración del icono de marcador
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapSelector({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

function CrearEvento({ onEventoCreado }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [imagenLinks, setImagenLinks] = useState([""]);
  const [localizacion, setLocalizacion] = useState({ lat: 37.7796, lng: -3.7849 }); // Coordenadas iniciales válidas
  const [etiquetas, setEtiquetas] = useState([]);
  const [etiquetaActual, setEtiquetaActual] = useState("");
  const [etiquetasExistentes, setEtiquetasExistentes] = useState([]);
  const navigate = useNavigate();

  const isValidLatLng = (latlng) => {
    return latlng && typeof latlng.lat === "number" && typeof latlng.lng === "number";
  };

  const handleImagenesChange = (e) => {
    const files = Array.from(e.target.files);
    setImagenes(files);
  };

  const handleImagenLinkChange = (index, value) => {
    const newLinks = [...imagenLinks];
    newLinks[index] = value;
    setImagenLinks(newLinks);
  };

  const handleAddImagenLink = () => {
    setImagenLinks([...imagenLinks, ""]);
  };

  const handleLocalizacionChange = (e) => {
    const value = e.target.value;
    const [lat, lng] = value.split(",").map((coord) => parseFloat(coord.trim()));
    if (!isNaN(lat) && !isNaN(lng)) {
      setLocalizacion({ lat, lng });
    } else {
      setLocalizacion(value); // Mantener el valor como texto si no es válido
    }
  };

  const handleGeocode = async (direccion) => {
    if (!direccion || direccion.trim() === "") {
      return Swal.fire("Error", "Por favor, ingresa una dirección válida", "error");
    }

    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: direccion,
          format: "json",
          addressdetails: 1,
        },
      });

      if (res.data.length > 0) {
        const { lat, lon } = res.data[0];
        setLocalizacion({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        Swal.fire("Error", "No se encontró la dirección", "error");
      }
    } catch (err) {
      console.error("Error al geocodificar la dirección:", err);
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

  const handleEliminarEtiqueta = (index) => {
    setEtiquetas(etiquetas.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!localStorage.getItem("token")) {
      return Swal.fire("Error", "No estás autenticado. Por favor, inicia sesión.", "error");
    }

    if (!titulo || !descripcion || !fecha || !hora) {
      return Swal.fire("Error", "Todos los campos son obligatorios", "error");
    }

    // Combinar fecha y hora en formato ISO y ajustar -2 horas para compensar el desfase de la base de datos
    let fechaHoraLocal = new Date(`${fecha}T${hora}`);
    fechaHoraLocal.setHours(fechaHoraLocal.getHours());
    const fechaHora = fechaHoraLocal.toISOString().slice(0, 16); // formato 'YYYY-MM-DDTHH:mm'

    const formData = {
      titulo,
      descripcion,
      fecha: fechaHora,
      imagenes: JSON.stringify(imagenLinks.filter((link) => link.trim() !== "")),
      localizacion: typeof localizacion === 'object' ? `${localizacion.lat},${localizacion.lng}` : localizacion,
      etiquetas,
    };

    try {
      const res = await api.post("/eventos", formData);

      Swal.fire("¡Evento creado!", "Tu evento se ha creado con éxito", "success");
      setTitulo("");
      setDescripcion("");
      setFecha("");
      setHora("");
      setImagenLinks([""]);
      setEtiquetas([]);
      if (onEventoCreado) onEventoCreado(res.data);
      setTimeout(() => {
        navigate("/eventos");
      }, 1200);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo crear el evento", "error");
    }
  };

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

  return (
    <div className="mb-6 bg-white shadow p-4 rounded-xl">
      <h2 className="text-xl font-bold mb-2 text-purple-600">Crear nuevo evento</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <textarea
          placeholder="Descripción..."
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows="4"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="date"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <input
          type="time"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
        />
        <input
          type="text"
          placeholder="Localización (dirección o coordenadas)"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={localizacion}
          onChange={handleLocalizacionChange}
        />
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => handleGeocode(localizacion)}
        >
          Buscar dirección
        </button>
        <div className="w-full h-64 mb-4">
          <MapContainer
            center={[37.7796, -3.7849]} // Coordenadas iniciales (Jaén, España)
            zoom={13}
            className="h-full w-full rounded"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
            {isValidLatLng(localizacion) && (
              <Marker
                position={localizacion}
                icon={customIcon}
              />
            )}
            <MapSelector
              onLocationSelect={(latlng) => setLocalizacion(latlng)}
            />
          </MapContainer>
        </div>
        {imagenLinks.map((link, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="URL de la imagen"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={link}
              onChange={(e) => handleImagenLinkChange(index, e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
          onClick={handleAddImagenLink}
        >
          Añadir otra imagen
        </button>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Etiquetas</label>
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
          <input
            type="text"
            placeholder="Añade una etiqueta y pulsa Enter"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={etiquetaActual}
            onChange={e => setEtiquetaActual(e.target.value)}
            onKeyDown={handleEtiquetaKeyDown}
            list="etiquetas-sugeridas"
          />
          <datalist id="etiquetas-sugeridas">
            {etiquetasExistentes.map((et, i) => (
              <option key={i} value={et} />
            ))}
          </datalist>
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Crear Evento
        </button>
      </form>
    </div>
  );
}

export default CrearEvento;
