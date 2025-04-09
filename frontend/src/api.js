import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Cambia el puerto si tu backend usa otro
});

export default api;
