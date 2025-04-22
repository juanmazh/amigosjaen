import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.css';
import AuthContext from "./context/AuthContext"; // Asegúrate de la ruta correcta

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthContext>
      <App />
    </AuthContext>
    </BrowserRouter>
  </React.StrictMode>
);
