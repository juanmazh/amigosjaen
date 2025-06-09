# AmigosJaén

AmigosJaén es una plataforma web para conectar personas en Jaén y alrededores, facilitando la organización de eventos, actividades y la creación de nuevas amistades. Es un proyecto desarrollado como parte de los estudios de DAW en el IES Virgen del Carmen.

## Demo

Puedes consultar el estado de la web accediendo a:

https://amigosjaen.netlify.app/

## Características principales

- **Eventos**: Crea, edita, elimina e inscríbete en eventos locales. Visualiza asistentes y localización en mapa.
- **Foro**: Publica, comenta y etiqueta temas de interés para la comunidad.
- **Mensajes directos**: Chatea de forma privada con otros usuarios registrados.
- **Valoraciones**: Valora eventos finalizados y consulta la reputación de los organizadores.
- **Sistema de seguidores**: Sigue a otros usuarios y mantente al día de sus actividades.
- **Autenticación JWT**: Registro, login y gestión de sesiones seguras.
- **Panel de administración**: Gestión de usuarios, publicaciones y eventos para administradores.

## Tecnologías utilizadas

- **Frontend**: React, Vite, TailwindCSS, React Router, Axios, Leaflet (mapas), SweetAlert2
- **Backend**: Node.js, Express, Sequelize, MySQL, Socket.io, JWT, dotenv

## Estructura del proyecto

- `/frontend`: Aplicación cliente (React)
- `/backend`: API RESTful y WebSocket (Node.js/Express)
- `/migrations`: Migraciones de base de datos (Sequelize)
- `/seeders`: Datos de ejemplo para desarrollo

## Instalación y ejecución local

1. Clona el repositorio y entra en la carpeta principal.
2. Configura la base de datos MySQL y ajusta `config/config.json` según tus credenciales.
3. Instala dependencias:
   - Backend: `cd backend && npm install`
   - Frontend: `cd ../frontend && npm install`
4. Ejecuta migraciones:
   - `npx sequelize-cli db:migrate`
5. Inicia el backend:
   - `npm start` (desde `/backend`)
6. Inicia el frontend:
   - `npm run dev` (desde `/frontend`)

## Contacto

¿Tienes dudas, sugerencias o quieres colaborar? Puedes contactar conmigo en:
- Email: juanmazh.dev@gmail.com

---

Proyecto desarrollado por Juan Manuel Zafra Hernández para DAW 2025.
