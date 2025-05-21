-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 11, 2025 at 05:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inmobiliaria`
--

-- --------------------------------------------------------

--
-- Table structure for table `administracion`
--

CREATE TABLE `administracion` (
  `id_user` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `mail` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `administracion`
--

INSERT INTO `administracion` (`id_user`, `name`, `mail`, `password`) VALUES
(1, 'Samuel Juarez Lucas', 'samueladmin.90@gmail.com', 'samadmin123');

-- --------------------------------------------------------

--
-- Table structure for table `publicaciones`
--

CREATE TABLE `publicaciones` (
  `id_publicacion` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `fecha_subida` date DEFAULT curdate(),
  `imagenes` longtext DEFAULT NULL,
  `PRO` varchar(20) NOT NULL,
  `ESTADO` varchar(50) NOT NULL,
  `MUN` varchar(50) NOT NULL,
  `HAB` int(10) NOT NULL,
  `BAN` int(10) NOT NULL,
  `EST` varchar(5) NOT NULL,
  `AMU` varchar(5) NOT NULL,
  `TAM` varchar(50) NOT NULL,
  `PRE` varchar(50) NOT NULL,
  `DES` text NOT NULL,
  `Extras` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`Extras`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `publicaciones`
--

INSERT INTO `publicaciones` (`id_publicacion`, `id_user`, `fecha_subida`, `imagenes`, `PRO`, `ESTADO`, `MUN`, `HAB`, `BAN`, `EST`, `AMU`, `TAM`, `PRE`, `DES`, `Extras`) VALUES
(13, 8, '2025-04-27', '[\"/uploads/25728937560_1f81b89fb8_o.jpg\",\"/uploads/casa.jpg\",\"/uploads/fondo2.jpg\"]', 'Casa', 'Morelos', 'Cuernavaca', 5, 4, 'Sí', 'Sí', '600', '2500000', 'Vive el confort en esta espectacular casa de 3 habitaciones, 2 baños completos y un amplio jardín privado. Con acabados de lujo, cocina equipada de concepto abierto y cochera para 2 autos, esta propiedad es ideal para familias que buscan comodidad y ', '[\"Alberca\",\"Jacuzzi\",\"Terraza\",\"Área de juegos infantiles\",\"Aire acondicionado\",\"Seguridad privada\",\"Sistema de riego\"]'),
(14, 15, '2025-04-27', '[\"/uploads/fondo3.jpg\",\"/uploads/fondo4.jpg\",\"/uploads/fondo5.jpg\"]', 'Departamento', 'Querétaro', 'Av. De La Luz', 2, 1, 'No', 'Sí', '250', '4500000', '¿Sueñas con despertar rodeado de naturaleza? Esta hermosa casa de campo ofrece 4 recámaras, terraza con vista panorámica, y un terreno de más de 800 m² para disfrutar del aire libre. Perfecta para quienes buscan paz y privacidad, a tan solo 15 minuto', '[\"Jacuzzi\",\"Roof Garden\",\"Cuarto de TV\",\"Salón de usos múltiples\",\"Gimnasio\"]'),
(15, 14, '2025-04-27', '[\"/uploads/1-terreno.jpg\",\"/uploads/images.jpg\"]', 'Terreno', 'Estado de México', 'toluca', 8, 2, 'Sí', 'No', '600', '2500000', 'Oportunidad única: terreno de 600 m² en zona de alta plusvalía, perfecto para construir la casa de tus sueños o invertir en un desarrollo. Totalmente plano, con servicios de agua, luz y drenaje a pie de calle. A sólo 10 minutos del centro y con fácil', '[\"Seguridad privada\",\"Mercados cercanos\",\"Restaurantes cercanos\"]'),
(25, 17, '2025-05-10', '[\"/uploads/imagenes-1746931021080-972835553.png\",\"/uploads/imagenes-1746931021119-450472599.png\",\"/uploads/imagenes-1746931021127-312118384.png\",\"/uploads/imagenes-1746931021138-263845145.png\"]', 'Departamento', 'Oaxaca', 'Chichinapas', 1, 5, 'Sí', 'No', '1,250', '805,000', 'OLA', '[\"Cuarto de TV\",\"Salón de usos múltiples\",\"Aire acondicionado\",\"Gimnasio\"]');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id_user` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `mail` varchar(100) NOT NULL,
  `password` varchar(25) NOT NULL,
  `user_validation` varchar(2) NOT NULL DEFAULT 'F'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id_user`, `name`, `mail`, `password`, `user_validation`) VALUES
(8, 'Samuel', 'samueljuarezlucas.90@gmail.com', 'pumas123', 'T'),
(9, 'Samuel', 'samueljuarezlucas.91@gmail.com', '123', 'F'),
(10, 'Martin', 'cytus@gmail.com', 'pepe', 'F'),
(11, 'hola', 'shon.90@gmail.com', 'pepe', 'F'),
(12, 'Joselito', 'cytus2@gmail.com', '123', 'F'),
(13, 'Manuel Ivan', 'ivan.90@gmail.com', 'tigre123', 'F'),
(14, 'Erick Issac', 'erick.90@gmail.com', 'kcheleando', 'T'),
(15, 'Jean Emmanuel', 'jean.90@gmail.com', 'jean123', 'T'),
(17, 'Emiliano Arias', 'emiliano.90@gmail.com', 'emiliano123', 'T'),
(18, 'Ivan Tigre', 'ivan.91@gmail.com', 'ivan123', 'T'),
(19, 'Chris menso', 'cytusproplayer777@gmail.com', 'eltronodemexico', 'F');

-- --------------------------------------------------------

--
-- Table structure for table `validaru`
--

CREATE TABLE `validaru` (
  `id_user` int(10) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `mail2` varchar(50) NOT NULL,
  `ine_photo` varchar(255) NOT NULL,
  `curp` varchar(18) NOT NULL,
  `rfc` varchar(13) NOT NULL,
  `photo_user` varchar(255) NOT NULL,
  `status` varchar(20) DEFAULT 'En revisión'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `validaru`
--

INSERT INTO `validaru` (`id_user`, `phone`, `mail2`, `ine_photo`, `curp`, `rfc`, `photo_user`, `status`) VALUES
(15, '7771377483', 'jean.90@gmail.com', '/uploads/ine2.webp', 'JAB050921HMSRCMA9B', 'JAB050921HMSR', '/uploads/p2.jpg', 'Validado'),
(14, '2211996527', 'erick.90@gmail.com', '/uploads/ine3.jpg', 'EI050921HMSRCMA9AB', 'EI050921HMSRC', '/uploads/p3.webp', 'Validado'),
(8, '7776438044', 'samueljuarezlucas.90@gmail.com', '/uploads/ine_juana.jpg', 'JULS050921HMSRCMA9', 'JUGR670216T8A', '/uploads/juana.jpg', 'Validado'),
(16, '4427758110', 'berny.90@gmail.com', '/uploads/ine_photo-1745949142277-430304374.jpg', 'BN050921HMSRCMA9E', 'BR670216T8AER', '/uploads/photo_user-1745949142282-127295729.jpg', 'Validado'),
(17, '777-137-74-83', 'cytus@gmail.com', '/uploads/ine_photo-1746500683946-911802896.png', 'JULS050921HMSRCMA9', 'JUGR670216T8A', '/uploads/photo_user-1746500683971-129287265.png', 'Validado'),
(18, '777-643-80-45', 'samueljuarezlucas.90@gmail.com', '/uploads/ine_photo-1746470104998-938084902.jpg', 'JULS050921HMSRCMA9', 'JUGR670216T8A', '/uploads/photo_user-1746470105004-66657098.webp', 'Validado'),
(12, '777-137-74-83', 'samueljuarezlucas.90@gmail.com', '/uploads/ine_photo-1746549203376-776380083.jpg', 'JULS050921HMSRCMA9', 'JUGR670216T8A', '/uploads/photo_user-1746549203387-822737381.jpg', 'En revisión'),
(19, '666-666-66-66', 'cytus@gmail.com', '/uploads/ine_photo-1746549517061-675006476.jpg', 'ASDASDHGHG', 'A3DTFHHTFHG', '/uploads/photo_user-1746549517067-87965060.jpg', 'En revisión');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `administracion`
--
ALTER TABLE `administracion`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- Indexes for table `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD PRIMARY KEY (`id_publicacion`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `administracion`
--
ALTER TABLE `administracion`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `publicaciones`
--
ALTER TABLE `publicaciones`
  MODIFY `id_publicacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
