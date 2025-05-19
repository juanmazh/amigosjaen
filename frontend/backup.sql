-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: amigosjaen
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AsistentesEventos`
--

DROP TABLE IF EXISTS `AsistentesEventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AsistentesEventos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarioId` int DEFAULT NULL,
  `eventoId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuarioId` (`usuarioId`),
  KEY `eventoId` (`eventoId`),
  CONSTRAINT `AsistentesEventos_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `AsistentesEventos_ibfk_2` FOREIGN KEY (`eventoId`) REFERENCES `Eventos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AsistentesEventos`
--

LOCK TABLES `AsistentesEventos` WRITE;
/*!40000 ALTER TABLE `AsistentesEventos` DISABLE KEYS */;
INSERT INTO `AsistentesEventos` VALUES (1,1,1,'2025-05-19 17:02:29','2025-05-19 17:02:29'),(2,9,1,'2025-05-19 17:08:31','2025-05-19 17:08:31'),(3,1,2,'2025-05-19 17:13:57','2025-05-19 17:13:57'),(4,9,2,'2025-05-19 17:14:21','2025-05-19 17:14:21');
/*!40000 ALTER TABLE `AsistentesEventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Etiqueta`
--

DROP TABLE IF EXISTS `Etiqueta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Etiqueta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`(191))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Etiqueta`
--

LOCK TABLES `Etiqueta` WRITE;
/*!40000 ALTER TABLE `Etiqueta` DISABLE KEYS */;
INSERT INTO `Etiqueta` VALUES (1,'age','2025-05-12 15:27:11','2025-05-12 15:27:11'),(2,'of','2025-05-12 15:27:11','2025-05-12 15:27:11'),(3,'empires','2025-05-12 15:27:11','2025-05-12 15:27:11'),(4,'fg','2025-05-12 15:38:31','2025-05-12 15:38:31'),(5,'agafa','2025-05-12 15:56:07','2025-05-12 15:56:07'),(6,'fdsfsdfsdfsd','2025-05-12 15:58:31','2025-05-12 15:58:31'),(7,'hola','2025-05-12 15:58:31','2025-05-12 15:58:31'),(8,'sad','2025-05-12 16:05:57','2025-05-12 16:05:57'),(9,'miaus','2025-05-12 16:10:49','2025-05-12 16:10:49'),(10,'apetecan','2025-05-12 16:19:11','2025-05-12 16:19:11'),(11,'massa','2025-05-12 16:22:31','2025-05-12 16:22:31'),(12,'lilcapitolio','2025-05-13 15:21:14','2025-05-13 15:21:14'),(13,'ciberseguridad','2025-05-19 15:50:00','2025-05-19 15:50:00');
/*!40000 ALTER TABLE `Etiqueta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Eventos`
--

DROP TABLE IF EXISTS `Eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Eventos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha` datetime NOT NULL,
  `asistentes` int DEFAULT '0',
  `imagenes` text DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `usuarioId` int DEFAULT NULL,
  `localizacion` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuarioId` (`usuarioId`),
  CONSTRAINT `Eventos_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Eventos`
--

LOCK TABLES `Eventos` WRITE;
/*!40000 ALTER TABLE `Eventos` DISABLE KEYS */;
INSERT INTO `Eventos` VALUES (1,'test','fsdfmlksdlmkfd','2026-03-03 00:00:00',0,'[\"https://cdn.pixabay.com/photo/2019/10/15/04/42/jaen-4550553_1280.jpg\", \"https://cdn.pixabay.com/photo/2019/10/15/04/42/jaen-4550553_1280.jpg\", \"https://cdn.pixabay.com/photo/2019/10/15/04/42/jaen-4550553_1280.jpg\", \"https://cdn.pixabay.com/photo/2019/10/15/04/42/jaen-4550553_1280.jpg\"]',1,1,'37.77621009495645,-3.7875366210937504','2025-05-19 16:19:04','2025-05-19 16:19:04'),(2,'Prueba','borrar gente','2028-07-02 00:00:00',0,'[]',1,1,'37.785259583504434,-3.804331934615415','2025-05-19 17:13:52','2025-05-19 17:13:52');
/*!40000 ALTER TABLE `Eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PublicacionEtiquetas`
--

DROP TABLE IF EXISTS `PublicacionEtiquetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PublicacionEtiquetas` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `PublicacionId` int NOT NULL,
  `EtiquetumId` int NOT NULL,
  PRIMARY KEY (`PublicacionId`,`EtiquetumId`),
  KEY `EtiquetumId` (`EtiquetumId`),
  CONSTRAINT `PublicacionEtiquetas_ibfk_2` FOREIGN KEY (`EtiquetumId`) REFERENCES `Etiqueta` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PublicacionEtiquetas`
--

LOCK TABLES `PublicacionEtiquetas` WRITE;
/*!40000 ALTER TABLE `PublicacionEtiquetas` DISABLE KEYS */;
INSERT INTO `PublicacionEtiquetas` VALUES ('2025-05-12 16:19:11','2025-05-12 16:19:11',7,1),('2025-05-12 16:19:11','2025-05-12 16:19:11',7,7),('2025-05-12 16:19:11','2025-05-12 16:19:11',7,10),('2025-05-12 16:22:31','2025-05-12 16:22:31',8,3),('2025-05-12 16:22:31','2025-05-12 16:22:31',8,4),('2025-05-12 16:22:31','2025-05-12 16:22:31',8,11),('2025-05-13 15:21:14','2025-05-13 15:21:14',9,12),('2025-05-19 15:50:00','2025-05-19 15:50:00',10,13),('2025-05-19 15:58:26','2025-05-19 15:58:26',12,13),('2025-05-19 15:58:56','2025-05-19 15:58:56',14,13);
/*!40000 ALTER TABLE `PublicacionEtiquetas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Publicaciones`
--

DROP TABLE IF EXISTS `Publicaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Publicaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `contenido` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UsuarioId` int DEFAULT NULL,
  `etiquetas` text,
  PRIMARY KEY (`id`),
  KEY `UsuarioId` (`UsuarioId`),
  CONSTRAINT `Publicaciones_ibfk_1` FOREIGN KEY (`UsuarioId`) REFERENCES `Usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Publicaciones`
--

LOCK TABLES `Publicaciones` WRITE;
/*!40000 ALTER TABLE `Publicaciones` DISABLE KEYS */;
INSERT INTO `Publicaciones` VALUES (2,'Hola','dksadjjasdas','2025-05-12 16:05:50','2025-05-12 16:05:50',1,NULL),(3,'Hola','dksadjjasdas','2025-05-12 16:05:53','2025-05-12 16:05:53',1,NULL),(7,'age hola y apetecan','age hola y apetecasdncsanjkdaknjdankjclksaldsa','2025-05-12 16:19:11','2025-05-12 16:19:11',7,NULL),(8,'Preueba con empires y fg y massa','testtststststststs','2025-05-12 16:22:31','2025-05-12 16:22:31',7,NULL),(11,'hjgjghjgjgh','saddsdasda','2025-05-19 15:52:58','2025-05-19 15:52:58',1,NULL),(12,'ciberseguridad','ssakdalksdakl','2025-05-19 15:58:26','2025-05-19 15:58:26',1,NULL),(14,'dsadas','asdsadasdsa','2025-05-19 15:58:56','2025-05-19 15:58:56',1,NULL);
/*!40000 ALTER TABLE `Publicaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20250512155327-create-publicacion-etiquetas.js'),('20250512160337-remove-foreign-key-publicacion-etiquetas.js'),('20250512160353-remove-foreign-key-publicacion-etiquetas.js'),('20250514120000-create-eventos.js'),('20250514120001-create-asistentes-eventos.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuarios`
--

DROP TABLE IF EXISTS `Usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `rol` varchar(255) DEFAULT 'usuario',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`(191))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuarios`
--

LOCK TABLES `Usuarios` WRITE;
/*!40000 ALTER TABLE `Usuarios` DISABLE KEYS */;
INSERT INTO `Usuarios` VALUES (1,'admin','admin@admin.com','$2b$10$Y8gLEENRQr3IaDzCh60N0eqFluYCG.xFJXxmRRW0W.um0TZmp5K0.','2025-04-09 15:58:10','2025-04-09 15:58:10','admin'),(2,'Juan','juan@mail.com','$2b$10$YRVrkcRs0xlSB/t2AIvezOBNDinGTu4NBoaPpc3bTu.cV9dIex34q','2025-04-09 15:59:26','2025-05-07 15:59:57','cliente'),(7,'test','test@test.com','$2b$10$Tm0IYhRwjnBnd7y2oR6SuuPA52Wn4olIjYY0o4uuwrafW/Yly6.Zu','2025-05-12 16:18:35','2025-05-12 16:18:35','usuario'),(8,'prueba','prueba@prueba.com','$2b$10$PO1Pvepro5XMIN6Wp34n4ub2iW0eBhpHada5Ygy0B6swaJiMpVT3O','2025-05-13 14:50:16','2025-05-13 14:50:16','cliente'),(9,'capi','capi@gmail.com','$2b$10$DFgoKD3mbxBzeojiwl602OxzEEpZMv0Qh2uQtNWwd1m6Ve2pai5Bu','2025-05-19 17:05:34','2025-05-19 17:05:34','usuario');
/*!40000 ALTER TABLE `Usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-19 19:43:08
