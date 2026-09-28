-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 28-09-2026 a las 22:51:37
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `telemedicina2026`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`) VALUES
(1, 'Termómetro'),
(2, 'Estetoscopio'),
(3, 'Silla de ruedas'),
(4, 'Camilla'),
(5, 'Gotero'),
(6, 'Ventilador'),
(7, 'Escalpelo'),
(8, 'Suero'),
(9, 'Gasas'),
(10, 'Monitor'),
(11, 'Dermatoscopio'),
(12, 'Agujas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestores`
--

CREATE TABLE `gestores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `gestores`
--

INSERT INTO `gestores` (`id`, `nombre`, `apellidos`, `usuario`, `password`) VALUES
(1, 'Miguel', 'Cartagena Galiano', 'miguel', 'admin'),
(2, 'Diego', 'Marcos Jorquera', 'diego', 'admin'),
(3, 'Alberto Antonio', 'Ramón Fernández', 'alberto', 'admin');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modelos`
--

CREATE TABLE `modelos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `categoria` int(11) NOT NULL,
  `horas_maximas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modelos`
--

INSERT INTO `modelos` (`id`, `nombre`, `categoria`, `horas_maximas`) VALUES
(1, 'Infrarrojos', 1, 1),
(2, 'Mercurio', 1, 1),
(3, 'Acústico', 2, 12),
(4, 'Electrónico', 2, 12),
(5, 'Pediátrica', 3, 5),
(6, 'Todoterreno', 3, 5),
(7, 'Ortopédica', 4, 8),
(8, 'Articulada', 4, 8),
(9, 'Macro', 5, 17),
(10, 'Micro', 5, 17),
(11, 'Mascarilla', 6, 24),
(12, 'Intubación', 6, 24),
(13, 'Clásico', 7, 9),
(14, 'Especial', 7, 9),
(15, 'Fisiológico', 8, 3),
(16, 'Glucosado', 8, 3),
(17, 'Algodón', 9, 2),
(18, 'Estériles', 9, 2),
(19, 'Portátil', 10, 20),
(20, 'Especializado', 10, 20),
(21, 'Manual', 11, 6),
(22, 'Fijo', 11, 6),
(23, 'Sutura', 12, 15),
(24, 'Biopsia', 12, 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recursos`
--

CREATE TABLE `recursos` (
  `id` int(11) NOT NULL,
  `modelo` int(11) NOT NULL,
  `ubicacion` int(11) NOT NULL,
  `numero_serie` varchar(50) NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recursos`
--

INSERT INTO `recursos` (`id`, `modelo`, `ubicacion`, `numero_serie`, `estado`) VALUES
(1, 1, 1, 'M1A001', 0),
(2, 1, 2, 'M1B002', 1),
(3, 2, 3, 'M2A003', 0),
(4, 2, 4, 'M2B004', 2),
(5, 3, 5, 'M3A005', 0),
(6, 3, 6, 'M3B006', 1),
(7, 4, 7, 'M4A007', 0),
(8, 4, 1, 'M4B008', 2),
(9, 5, 2, 'M5A009', 0),
(10, 5, 3, 'M5B010', 1),
(11, 6, 4, 'M6A011', 0),
(12, 6, 5, 'M6B012', 2),
(13, 7, 6, 'M7A013', 0),
(14, 7, 7, 'M7B014', 1),
(15, 8, 1, 'M8A015', 0),
(16, 8, 2, 'M8B016', 2),
(17, 9, 3, 'M9A017', 0),
(18, 9, 4, 'M9B018', 1),
(19, 10, 5, 'M10A019', 0),
(20, 10, 6, 'M10B020', 2),
(21, 11, 7, 'M11A021', 0),
(22, 11, 1, 'M11B022', 1),
(23, 12, 2, 'M12A023', 0),
(24, 12, 3, 'M12B024', 2),
(25, 13, 4, 'M13A025', 0),
(26, 13, 5, 'M13B026', 1),
(27, 14, 6, 'M14A027', 0),
(28, 14, 7, 'M14B028', 2),
(29, 15, 1, 'M15A029', 0),
(30, 15, 2, 'M15B030', 1),
(31, 16, 3, 'M16A031', 0),
(32, 16, 4, 'M16B032', 2),
(33, 17, 5, 'M17A033', 0),
(34, 17, 6, 'M17B034', 1),
(35, 18, 7, 'M18A035', 0),
(36, 18, 1, 'M18B036', 2),
(37, 19, 2, 'M19A037', 0),
(38, 19, 3, 'M19B038', 1),
(39, 20, 4, 'M20A039', 0),
(40, 20, 5, 'M20B040', 2),
(41, 21, 6, 'M21A041', 0),
(42, 21, 7, 'M21B042', 1),
(43, 22, 1, 'M22A043', 0),
(44, 22, 2, 'M22B044', 2),
(45, 23, 3, 'M23A045', 0),
(46, 23, 4, 'M23B046', 1),
(47, 24, 5, 'M24A047', 0),
(48, 24, 6, 'M24B048', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resenyas`
--

CREATE TABLE `resenyas` (
  `id` int(11) NOT NULL,
  `recurso` int(11) NOT NULL,
  `sanitario` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `valor` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `resenyas`
--

INSERT INTO `resenyas` (`id`, `recurso`, `sanitario`, `fecha`, `valor`, `descripcion`) VALUES
(1, 5, 1, '2026-01-10', 5, 'Funcionó perfectamente y estaba en muy buen estado.'),
(2, 30, 4, '2026-01-18', 3, 'Aceptable, aunque necesitaba limpieza.'),
(3, 21, 3, '2026-01-16', 4, 'Buen rendimiento, fácil de usar.'),
(4, 9, 1, '2026-01-21', 2, 'Tenía pequeños fallos, debería revisarse.'),
(5, 5, 2, '2026-01-23', 4, 'Buen estado general.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `recurso` int(11) NOT NULL,
  `sanitario` int(11) NOT NULL,
  `horas_estimadas` int(11) NOT NULL,
  `fecha_peticion` date NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`id`, `recurso`, `sanitario`, `horas_estimadas`, `fecha_peticion`, `fecha_inicio`, `fecha_fin`) VALUES
(1, 5, 1, 3, '2026-01-10', '2026-01-10', '2026-01-10'),
(2, 12, 2, 5, '2026-01-12', NULL, NULL),
(3, 21, 3, 8, '2026-01-15', '2026-01-15', NULL),
(4, 30, 4, 2, '2026-01-18', '2026-01-18', '2026-01-18'),
(5, 9, 1, 4, '2026-01-20', NULL, NULL),
(6, 5, 2, 2, '2026-01-22', NULL, NULL),
(7, 5, 3, 6, '2026-01-23', '2026-01-23', NULL),
(8, 12, 4, 1, '2026-01-25', '2026-01-25', '2026-01-25'),
(9, 30, 2, 4, '2026-01-26', NULL, NULL),
(10, 21, 1, 3, '2026-01-27', '2026-01-27', '2026-01-27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sanitarios`
--

CREATE TABLE `sanitarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sanitarios`
--

INSERT INTO `sanitarios` (`id`, `nombre`, `apellidos`, `usuario`, `password`) VALUES
(1, 'Raquel', 'Gosálbez Sirvent', 'raquel', '1234'),
(2, 'Fernando', 'Chillón Hernández', 'fernando', '1234'),
(3, 'Guillermo', 'Varela Carbajal', 'guillermo', '1234'),
(4, 'Marina', 'Hernández Gómez', 'marina', '1234');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicaciones`
--

CREATE TABLE `ubicaciones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ubicaciones`
--

INSERT INTO `ubicaciones` (`id`, `nombre`) VALUES
(1, 'Sala Común 1'),
(2, 'Almacén 1'),
(3, 'Laboratorio 1'),
(4, 'Sala Común 2'),
(5, 'Almacén 2'),
(6, 'Laboratorio 2'),
(7, 'Quirófano 1');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `gestores`
--
ALTER TABLE `gestores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `modelos`
--
ALTER TABLE `modelos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `modelos_categoria` (`categoria`);

--
-- Indices de la tabla `recursos`
--
ALTER TABLE `recursos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recursos_modelo` (`modelo`),
  ADD KEY `recursos_ubicacion` (`ubicacion`);

--
-- Indices de la tabla `resenyas`
--
ALTER TABLE `resenyas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `resenyas_recurso` (`recurso`),
  ADD KEY `resenyas_sanitario` (`sanitario`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reservas_recurso` (`recurso`),
  ADD KEY `reservas_sanitario` (`sanitario`);

--
-- Indices de la tabla `sanitarios`
--
ALTER TABLE `sanitarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `gestores`
--
ALTER TABLE `gestores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `modelos`
--
ALTER TABLE `modelos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `recursos`
--
ALTER TABLE `recursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de la tabla `resenyas`
--
ALTER TABLE `resenyas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `sanitarios`
--
ALTER TABLE `sanitarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `modelos`
--
ALTER TABLE `modelos`
  ADD CONSTRAINT `modelos_categoria` FOREIGN KEY (`categoria`) REFERENCES `categorias` (`id`);

--
-- Filtros para la tabla `recursos`
--
ALTER TABLE `recursos`
  ADD CONSTRAINT `recursos_modelo` FOREIGN KEY (`modelo`) REFERENCES `modelos` (`id`),
  ADD CONSTRAINT `recursos_ubicacion` FOREIGN KEY (`ubicacion`) REFERENCES `ubicaciones` (`id`);

--
-- Filtros para la tabla `resenyas`
--
ALTER TABLE `resenyas`
  ADD CONSTRAINT `resenyas_recurso` FOREIGN KEY (`recurso`) REFERENCES `recursos` (`id`),
  ADD CONSTRAINT `resenyas_sanitario` FOREIGN KEY (`sanitario`) REFERENCES `sanitarios` (`id`);

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_recurso` FOREIGN KEY (`recurso`) REFERENCES `recursos` (`id`),
  ADD CONSTRAINT `reservas_sanitario` FOREIGN KEY (`sanitario`) REFERENCES `sanitarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
