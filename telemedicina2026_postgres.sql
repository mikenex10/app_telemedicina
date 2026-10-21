CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre varchar(50) NOT NULL
);

INSERT INTO categorias (id, nombre) VALUES
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

CREATE TABLE ubicaciones (
  id SERIAL PRIMARY KEY,
  nombre varchar(50) NOT NULL
);

INSERT INTO ubicaciones (id, nombre) VALUES
(1, 'Sala Común 1'),
(2, 'Almacén 1'),
(3, 'Laboratorio 1'),
(4, 'Sala Común 2'),
(5, 'Almacén 2'),
(6, 'Laboratorio 2'),
(7, 'Quirófano 1');

CREATE TABLE gestores (
  id SERIAL PRIMARY KEY,
  nombre varchar(50) NOT NULL,
  apellidos varchar(50) NOT NULL,
  usuario varchar(50) NOT NULL,
  password varchar(50) NOT NULL
);

INSERT INTO gestores (id, nombre, apellidos, usuario, password) VALUES
(1, 'Miguel', 'Cartagena Galiano', 'miguel', 'admin'),
(2, 'Diego', 'Marcos Jorquera', 'diego', 'admin'),
(3, 'Alberto Antonio', 'Ramón Fernández', 'alberto', 'admin');

CREATE TABLE areas (
  id SERIAL PRIMARY KEY,
  codigo_postal varchar(5) NOT NULL UNIQUE,
  nombre varchar(50) NOT NULL,
  gestor integer NOT NULL REFERENCES gestores (id)
);

INSERT INTO areas (id, codigo_postal, nombre, gestor) VALUES
(1, '03300', 'Orihuela', 1),
(3, '03690', 'San Vicente', 1);

CREATE TABLE modelos (
  id SERIAL PRIMARY KEY,
  nombre varchar(50) NOT NULL,
  categoria integer NOT NULL REFERENCES categorias (id),
  horas_maximas integer NOT NULL
);

INSERT INTO modelos (id, nombre, categoria, horas_maximas) VALUES
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

CREATE TABLE recursos (
  id SERIAL PRIMARY KEY,
  modelo integer NOT NULL REFERENCES modelos (id),
  ubicacion integer NOT NULL REFERENCES ubicaciones (id),
  numero_serie varchar(50) NOT NULL,
  estado integer NOT NULL
);

INSERT INTO recursos (id, modelo, ubicacion, numero_serie, estado) VALUES
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

CREATE TABLE sanitarios (
  id SERIAL PRIMARY KEY,
  nombre varchar(50) NOT NULL,
  apellidos varchar(50) NOT NULL,
  usuario varchar(50) NOT NULL,
  password varchar(50) NOT NULL,
  area integer DEFAULT NULL REFERENCES areas (id)
);

INSERT INTO sanitarios (id, nombre, apellidos, usuario, password, area) VALUES
(1, 'Raquel', 'Gosálbez Sirvent', 'raquel', '1234', 1),
(2, 'Fernando', 'Chillón Hernández', 'fernando', '1234', NULL),
(3, 'Guillermo', 'Varela Carbajal', 'guillermo', '1234', NULL),
(4, 'Marina', 'Hernández Gómez', 'marina', '1234', NULL);

CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  recurso integer NOT NULL REFERENCES recursos (id),
  sanitario integer NOT NULL REFERENCES sanitarios (id),
  horas_estimadas integer NOT NULL,
  fecha_peticion timestamp NOT NULL,
  fecha_inicio timestamp DEFAULT NULL,
  fecha_fin timestamp DEFAULT NULL
);

INSERT INTO reservas (id, recurso, sanitario, horas_estimadas, fecha_peticion, fecha_inicio, fecha_fin) VALUES
(1, 5, 1, 3, '2026-01-10 00:00:00', '2026-01-10 00:00:00', '2026-01-10 00:00:00'),
(2, 12, 2, 5, '2026-01-12 00:00:00', NULL, NULL),
(3, 21, 3, 8, '2026-01-15 00:00:00', '2026-01-15 00:00:00', NULL),
(4, 30, 4, 2, '2026-01-18 00:00:00', '2026-01-18 00:00:00', '2026-01-18 00:00:00'),
(5, 9, 1, 4, '2026-01-20 00:00:00', NULL, NULL),
(7, 5, 3, 6, '2026-01-23 00:00:00', '2026-01-23 00:00:00', '2026-01-23 06:00:00'),
(8, 12, 4, 1, '2026-01-25 00:00:00', '2026-01-25 00:00:00', '2026-01-25 00:00:00'),
(9, 30, 2, 4, '2026-01-26 00:00:00', NULL, NULL),
(10, 21, 1, 3, '2026-01-27 00:00:00', '2026-01-27 00:00:00', '2026-01-27 00:00:00'),
(14, 2, 1, 1, '2026-10-13 16:20:19', '2026-10-13 16:20:19', '2026-10-13 16:20:27'),
(15, 2, 1, 1, '2026-10-13 16:20:29', '2026-10-13 16:20:29', NULL);

CREATE TABLE resenyas (
  id SERIAL PRIMARY KEY,
  recurso integer NOT NULL REFERENCES recursos (id),
  sanitario integer NOT NULL REFERENCES sanitarios (id),
  fecha date NOT NULL,
  valor integer NOT NULL,
  descripcion varchar(100) NOT NULL
);

INSERT INTO resenyas (id, recurso, sanitario, fecha, valor, descripcion) VALUES
(1, 5, 1, '2026-01-10', 5, 'Funcionó perfectamente y estaba en muy buen estado.'),
(2, 30, 4, '2026-01-18', 3, 'Aceptable, aunque necesitaba limpieza.'),
(3, 21, 3, '2026-01-16', 4, 'Buen rendimiento, fácil de usar.'),
(4, 9, 1, '2026-01-21', 2, 'Tenía pequeños fallos, debería revisarse.'),
(5, 5, 2, '2026-01-23', 4, 'Buen estado general.'),
(6, 5, 1, '2026-10-13', 5, 'Está genial'),
(10, 5, 1, '2026-10-13', 3, 'No me gusta'),
(11, 21, 1, '2026-10-13', 5, 'ME ENCANTA'),
(12, 5, 1, '2026-10-13', 5, 'ME ENCANTA'),
(13, 5, 1, '2026-10-13', 5, 'Me gusta muuuucho'),
(14, 4, 1, '2026-10-13', 5, 'Me gusta muuuucho'),
(15, 4, 1, '2026-10-13', 2, 'No me gusta tanto'),
(16, 21, 1, '2026-10-13', 2, 'No sé yo'),
(17, 21, 1, '2026-10-13', 1, 'Terrible');

SELECT setval('categorias_id_seq', 12);
SELECT setval('ubicaciones_id_seq', 7);
SELECT setval('gestores_id_seq', 4);
SELECT setval('areas_id_seq', 3);
SELECT setval('modelos_id_seq', 24);
SELECT setval('recursos_id_seq', 48);
SELECT setval('sanitarios_id_seq', 5);
SELECT setval('reservas_id_seq', 15);
SELECT setval('resenyas_id_seq', 17);
