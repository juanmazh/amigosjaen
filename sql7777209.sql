-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Servidor: sql7.freesqldatabase.com
-- Tiempo de generación: 20-05-2025 a las 19:35:59
-- Versión del servidor: 5.5.62-0ubuntu0.14.04.1
-- Versión de PHP: 7.0.33-0ubuntu0.16.04.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sql7777209`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `AsistentesEventos`
--

CREATE TABLE `AsistentesEventos` (
  `id` int(11) NOT NULL,
  `usuarioId` int(11) DEFAULT NULL,
  `eventoId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `AsistentesEventos`
--

INSERT INTO `AsistentesEventos` (`id`, `usuarioId`, `eventoId`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2025-05-19 17:02:29', '2025-05-19 17:02:29'),
(5, 11, 1, '2025-05-19 18:46:55', '2025-05-19 18:46:55'),
(7, 12, 1, '2025-05-19 18:52:39', '2025-05-19 18:52:39'),
(8, 24, 1, '2025-05-20 05:47:53', '2025-05-20 05:47:53');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Etiquetas`
--

CREATE TABLE `Etiquetas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Etiquetas`
--

INSERT INTO `Etiquetas` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(1, 'age', '2025-05-12 15:27:11', '2025-05-12 15:27:11'),
(2, 'of', '2025-05-12 15:27:11', '2025-05-12 15:27:11'),
(3, 'empires', '2025-05-12 15:27:11', '2025-05-12 15:27:11'),
(4, 'fg', '2025-05-12 15:38:31', '2025-05-12 15:38:31'),
(5, 'agafa', '2025-05-12 15:56:07', '2025-05-12 15:56:07'),
(6, 'fdsfsdfsdfsd', '2025-05-12 15:58:31', '2025-05-12 15:58:31'),
(7, 'hola', '2025-05-12 15:58:31', '2025-05-12 15:58:31'),
(8, 'sad', '2025-05-12 16:05:57', '2025-05-12 16:05:57'),
(9, 'miaus', '2025-05-12 16:10:49', '2025-05-12 16:10:49'),
(10, 'apetecan', '2025-05-12 16:19:11', '2025-05-12 16:19:11'),
(11, 'massa', '2025-05-12 16:22:31', '2025-05-12 16:22:31'),
(12, 'lilcapitolio', '2025-05-13 15:21:14', '2025-05-13 15:21:14'),
(13, 'ciberseguridad', '2025-05-19 15:50:00', '2025-05-19 15:50:00'),
(14, 'amigosjaen', '2025-05-19 18:07:39', '2025-05-19 18:07:39'),
(15, 'jaen', '2025-05-19 18:07:39', '2025-05-19 18:07:39'),
(16, 'Movil', '2025-05-19 18:46:28', '2025-05-19 18:46:28'),
(17, 'primerpost', '2025-05-20 05:07:03', '2025-05-20 05:07:03'),
(18, 'duda', '2025-05-20 05:08:25', '2025-05-20 05:08:25'),
(19, 'dudaexistencial', '2025-05-20 05:08:25', '2025-05-20 05:08:25'),
(20, 'hash', '2025-05-20 15:04:37', '2025-05-20 15:04:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Eventos`
--

CREATE TABLE `Eventos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha` datetime NOT NULL,
  `asistentes` int(11) DEFAULT '0',
  `imagenes` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) DEFAULT '1',
  `usuarioId` int(11) DEFAULT NULL,
  `localizacion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Eventos`
--

INSERT INTO `Eventos` (`id`, `titulo`, `descripcion`, `fecha`, `asistentes`, `imagenes`, `activo`, `usuarioId`, `localizacion`, `createdAt`, `updatedAt`) VALUES
(1, 'test', 'fsdfmlksdlmkfd', '2026-03-03 00:00:00', 0, '[\"https://cdn.pixabay.com/photo/2019/10/15/04/42/jaen-4550553_1280.jpg\", \"https://cdn.pixabay.com/photo/2019/10/15/04/42/jaen-4550553_1280.jpg\", \"https://cdn.pixabay.com/photo/2019/10/15/04/42/jaen-4550553_1280.jpg\", \"https://cdn.pixabay.com/photo/2019/10/15/04/42/jaen-4550553_1280.jpg\"]', 1, 1, '37.77621009495645,-3.7875366210937504', '2025-05-19 16:19:04', '2025-05-19 16:19:04'),
(6, 'Botellón', 'Vamos a juntarnos a beber yonkilatas en teletubbies, pa las 22:00 o así.', '2025-06-04 00:00:00', 0, '[]', 1, 25, '37.768068680454725,-3.7835454940795903', '2025-05-20 15:07:30', '2025-05-20 15:07:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Publicaciones`
--

CREATE TABLE `Publicaciones` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contenido` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UsuarioId` int(11) DEFAULT NULL,
  `etiquetas` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Publicaciones`
--

INSERT INTO `Publicaciones` (`id`, `titulo`, `contenido`, `createdAt`, `updatedAt`, `UsuarioId`, `etiquetas`) VALUES
(15, 'Bienvenida a tod@s', 'Hola esto es amigosjaen y si estas leyendo este mensaje estas presenciando la version 0.2', '2025-05-19 18:07:38', '2025-05-19 18:07:38', 1, NULL),
(16, 'Prueba de Juanma ', 'Está prueba es desde el móvil ', '2025-05-19 18:46:28', '2025-05-19 18:46:28', 11, NULL),
(17, '¡Hola!', 'Este es mi primer post en AmigosJaén', '2025-05-20 05:07:02', '2025-05-20 05:07:02', 13, NULL),
(18, 'Duda', '¿En las publicaciones no se pueden agregar fotos? ¿Solo en los eventos?', '2025-05-20 05:08:24', '2025-05-20 05:08:24', 13, NULL),
(20, 'Amigos bibliotecarios ', 'Y si organizamos una quedada para bajar a la biblioteca y hacernos compañía?????? 👉🏻👈🏻', '2025-05-20 05:43:15', '2025-05-20 05:43:15', 22, NULL),
(22, 'Voy a llegar tarde a primera', 'Mi gente estamo en Japón gente con cojones yo se karate', '2025-05-20 05:47:15', '2025-05-20 05:47:15', 24, NULL),
(23, 'Gelatto Granaina', '-1 por 5.\n-5 por 20.\n-10 por 35.\nParque de los Patos, donde se pone toda la chusma al lado de la fuente.', '2025-05-20 15:04:37', '2025-05-20 15:04:37', 25, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `PublicacionEtiquetas`
--

CREATE TABLE `PublicacionEtiquetas` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `PublicacionId` int(11) NOT NULL,
  `EtiquetaId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `PublicacionEtiquetas`
--

INSERT INTO `PublicacionEtiquetas` (`createdAt`, `updatedAt`, `PublicacionId`, `EtiquetaId`) VALUES
('2025-05-12 16:19:11', '2025-05-12 16:19:11', 7, 1),
('2025-05-12 16:19:11', '2025-05-12 16:19:11', 7, 7),
('2025-05-12 16:19:11', '2025-05-12 16:19:11', 7, 10),
('2025-05-12 16:22:31', '2025-05-12 16:22:31', 8, 3),
('2025-05-12 16:22:31', '2025-05-12 16:22:31', 8, 4),
('2025-05-12 16:22:31', '2025-05-12 16:22:31', 8, 11),
('2025-05-13 15:21:14', '2025-05-13 15:21:14', 9, 12),
('2025-05-19 15:50:00', '2025-05-19 15:50:00', 10, 13),
('2025-05-19 15:58:26', '2025-05-19 15:58:26', 12, 13),
('2025-05-19 15:58:56', '2025-05-19 15:58:56', 14, 13),
('2025-05-19 18:07:39', '2025-05-19 18:07:39', 15, 14),
('2025-05-19 18:07:39', '2025-05-19 18:07:39', 15, 15),
('2025-05-19 18:46:28', '2025-05-19 18:46:28', 16, 12),
('2025-05-19 18:46:28', '2025-05-19 18:46:28', 16, 16),
('2025-05-20 05:07:03', '2025-05-20 05:07:03', 17, 7),
('2025-05-20 05:07:03', '2025-05-20 05:07:03', 17, 17),
('2025-05-20 05:08:25', '2025-05-20 05:08:25', 18, 18),
('2025-05-20 05:08:25', '2025-05-20 05:08:25', 18, 19),
('2025-05-20 15:04:37', '2025-05-20 15:04:37', 23, 15),
('2025-05-20 15:04:37', '2025-05-20 15:04:37', 23, 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `SequelizeMeta`
--

INSERT INTO `SequelizeMeta` (`name`) VALUES
('20250512155327-create-publicacion-etiquetas.js'),
('20250512160337-remove-foreign-key-publicacion-etiquetas.js'),
('20250512160353-remove-foreign-key-publicacion-etiquetas.js'),
('20250514120000-create-eventos.js'),
('20250514120001-create-asistentes-eventos.js');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Usuarios`
--

CREATE TABLE `Usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contraseña` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `rol` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Usuarios`
--

INSERT INTO `Usuarios` (`id`, `nombre`, `email`, `contraseña`, `createdAt`, `updatedAt`, `rol`) VALUES
(1, 'admin', 'admin@admin.com', '$2b$10$Y8gLEENRQr3IaDzCh60N0eqFluYCG.xFJXxmRRW0W.um0TZmp5K0.', '2025-04-09 15:58:10', '2025-04-09 15:58:10', 'admin'),
(2, 'Juan', 'juan@mail.com', '$2b$10$YRVrkcRs0xlSB/t2AIvezOBNDinGTu4NBoaPpc3bTu.cV9dIex34q', '2025-04-09 15:59:26', '2025-05-07 15:59:57', 'cliente'),
(7, 'test', 'test@test.com', '$2b$10$Tm0IYhRwjnBnd7y2oR6SuuPA52Wn4olIjYY0o4uuwrafW/Yly6.Zu', '2025-05-12 16:18:35', '2025-05-12 16:18:35', 'usuario'),
(8, 'prueba', 'prueba@prueba.com', '$2b$10$PO1Pvepro5XMIN6Wp34n4ub2iW0eBhpHada5Ygy0B6swaJiMpVT3O', '2025-05-13 14:50:16', '2025-05-13 14:50:16', 'cliente'),
(9, 'capi', 'capi@gmail.com', '$2b$10$DFgoKD3mbxBzeojiwl602OxzEEpZMv0Qh2uQtNWwd1m6Ve2pai5Bu', '2025-05-19 17:05:34', '2025-05-19 17:05:34', 'usuario'),
(10, 'fulano', 'fulano@gmail.com', '$2b$10$FAXhHdTkRz9kU.Hed5gYrOLHJLUQIG7pr31zLjHna5G5xGD2.DOBq', '2025-05-19 18:34:47', '2025-05-19 18:34:47', 'usuario'),
(11, 'Movil', 'movil@gmail.com', '$2b$10$/vq9qKQZ0tcroTr5cZnWfOD8v2AGFEMNThrGBLBlnGQq1.OIA3zpC', '2025-05-19 18:45:20', '2025-05-19 18:45:20', 'usuario'),
(12, 'nuria', 'nuria@gmail.com', '$2b$10$4U9mGn66h/yhj6RvK5YOdePX8Zb8WoAjLHwBWg3H4kgqjnOG3zI4.', '2025-05-19 18:52:02', '2025-05-19 18:52:02', 'usuario'),
(13, 'Minah', 'maariiaacr7@gmail.com', '$2b$10$h/OSpUjfA7wrASLh5aBSHuV4u4jUNKry2.QDjxd1Y6bLS5gkEptb6', '2025-05-20 05:03:23', '2025-05-20 05:03:23', 'usuario'),
(14, 'Maria', 'mmr00114@red.ujaen.es', '$2b$10$zyKHulGif.d.0KZWvWA.LO80AapbnB6EQ.O.HbqaPhiXX8PaUivHu', '2025-05-20 05:38:37', '2025-05-20 05:38:37', 'usuario'),
(22, 'Maria', 'maria_mr10@hotmail.com', '$2b$10$vnHdPfraxUtEsykrFCpsBeNXQW9724pki1tUFu4dgXASlML3/4wq2', '2025-05-20 05:39:21', '2025-05-20 05:39:21', 'usuario'),
(24, 'Joel Haro Carrasco ', 'joelcasillas79@gmail.com', '$2b$10$Jac5V3/oUyIzK2gGDEN8seFYsZpTUOPFC/EuohAyWNPl/WInVxp.i', '2025-05-20 05:45:08', '2025-05-20 05:45:08', 'usuario'),
(25, 'Locuelote333', 'isaacputonegro@gmail.com', '$2b$10$oClxmqD0Q.bBLo5K.LjUN.FtwBxSXLy0sdS0Zdj/aHs942B5F.h2q', '2025-05-20 15:01:48', '2025-05-20 15:01:48', 'usuario');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `AsistentesEventos`
--
ALTER TABLE `AsistentesEventos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuarioId` (`usuarioId`),
  ADD KEY `eventoId` (`eventoId`);

--
-- Indices de la tabla `Etiquetas`
--

--
-- Indices de la tabla `Eventos`
--
ALTER TABLE `Eventos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuarioId` (`usuarioId`);

--
-- Indices de la tabla `Publicaciones`
--
ALTER TABLE `Publicaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UsuarioId` (`UsuarioId`);

--
-- Indices de la tabla `PublicacionEtiquetas`
--
ALTER TABLE `PublicacionEtiquetas`
  ADD PRIMARY KEY (`PublicacionId`,`EtiquetaId`),
  ADD KEY `EtiquetaId` (`EtiquetaId`);

--
-- Indices de la tabla `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `Usuarios`
--
ALTER TABLE `Usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`(191));

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `AsistentesEventos`
--
ALTER TABLE `AsistentesEventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT de la tabla `Etiquetas`
--
ALTER TABLE `Etiquetas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT de la tabla `Eventos`
--
ALTER TABLE `Eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT de la tabla `Publicaciones`
--
ALTER TABLE `Publicaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT de la tabla `Usuarios`
--
ALTER TABLE `Usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `AsistentesEventos`
--
ALTER TABLE `AsistentesEventos`
  ADD CONSTRAINT `AsistentesEventos_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `AsistentesEventos_ibfk_2` FOREIGN KEY (`eventoId`) REFERENCES `Eventos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `Eventos`
--
ALTER TABLE `Eventos`
  ADD CONSTRAINT `Eventos_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `Publicaciones`
--
ALTER TABLE `Publicaciones`
  ADD CONSTRAINT `Publicaciones_ibfk_1` FOREIGN KEY (`UsuarioId`) REFERENCES `Usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `PublicacionEtiquetas`
--
ALTER TABLE `PublicacionEtiquetas`
  ADD CONSTRAINT `PublicacionEtiquetas_ibfk_2` FOREIGN KEY (`EtiquetaId`) REFERENCES `Etiquetas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
