import { useState } from "react";
import api from "../../api";
import Swal from "sweetalert2";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

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
  const [imagenes, setImagenes] = useState([]);
  const [imagenLinks, setImagenLinks] = useState([""]);
  const [localizacion, setLocalizacion] = useState({ lat: 37.7796, lng: -3.7849 }); // Coordenadas iniciales válidas

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!localStorage.getItem("token")) {
      return Swal.fire("Error", "No estás autenticado. Por favor, inicia sesión.", "error");
    }

    if (!titulo || !descripcion || !fecha) {
      return Swal.fire("Error", "Todos los campos son obligatorios", "error");
    }

    const formData = {
      titulo,
      descripcion,
      fecha,
      localizacion,
      imagenes: imagenLinks.filter((link) => link.trim() !== ""),
    };

    try {
      const res = await api.post("/eventos", formData);

      Swal.fire("¡Evento creado!", "Tu evento se ha creado con éxito", "success");
      setTitulo("");
      setDescripcion("");
      setFecha("");
      setImagenLinks([""]);
      if (onEventoCreado) onEventoCreado(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo crear el evento", "error");
    }
  };

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
