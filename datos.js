// =================================================================
// BASE DE DATOS
// Deprecated. Ya no utilizamos esta base de datos sino que ahora hay consexión SQL.
// =================================================================

function haceHoras(h) {
    return new Date(Date.now() - 1000 * 60 * 60 * h);
}

function haceDias(d) {
    return new Date(Date.now() - 1000 * 60 * 60 * 24 * d);
}

function haceMin(m) {
    return new Date(Date.now() - 1000 * 60 * m);
}

function sumarHoras(fecha, h) {
    return new Date(fecha.getTime() + 1000 * 60 * 60 * h);
}

function sumarMin(fecha, m) {
    return new Date(fecha.getTime() + 1000 * 60 * m);
}

var sanitarios = [
    {id: 1, nombre: "Raquel", apellidos: "Gosálbez Sirvent", usuario: "raquel", password: "1234"},
    {id: 2, nombre: "Fernando", apellidos: "Chillón Hernández", usuario: "fernando", password: "1234"},
    {id: 3, nombre: "Guillermo", apellidos: "Varela Carbajal", usuario: "guillermo", password: "1234"},
    {id: 4, nombre: "Marina", apellidos: "Hernández Gómez", usuario: "marina", password: "1234"}
];
var siguienteSanitario = sanitarios.length + 1;

var gestores = [
    {id: 1, nombre: "Miguel", apellidos: "Cartagena Galiano", usuario: "miguel", password: "admin"},
    {id: 2, nombre: "Diego", apellidos: "Marcos Jorquera", usuario: "diego", password: "admin"},
    {id: 3, nombre: "Alberto Antonio", apellidos: "Ramón Fernández", usuario: "alberto", password: "admin"}
];
var siguienteGestor = gestores.length + 1;

var ubicaciones = [
    {id: 1, nombre: "Sala Común 1"},
    {id: 2, nombre: "Almacén 1"},
    {id: 3, nombre: "Laboratorio 1"},
    {id: 4, nombre: "Sala Común 2"},
    {id: 5, nombre: "Almacén 2"},
    {id: 6, nombre: "Laboratorio 2"},
    {id: 7, nombre: "Quirófano 1"}
];

var categorias = [
    {id: 1, nombre: "Termómetro"},
    {id: 2, nombre: "Estetoscopio"},
    {id: 3, nombre: "Silla de ruedas"},
    {id: 4, nombre: "Camilla"},
    {id: 5, nombre: "Gotero"},
    {id: 6, nombre: "Ventilador"},
    {id: 7, nombre: "Escalpelo"},
    {id: 8, nombre: "Suero"},
    {id: 9, nombre: "Gasas"},
    {id: 10, nombre: "Monitor"},
    {id: 11, nombre: "Dermatoscopio"},
    {id: 12, nombre: "Agujas"}
];

var modelos = [
    {id: 1, nombre: "Infrarrojos", categoria: 1, horas_maximas: 1},
    {id: 2, nombre: "Mercurio", categoria: 1, horas_maximas: 1},
    {id: 3, nombre: "Acústico", categoria: 2, horas_maximas: 12},
    {id: 4, nombre: "Electrónico", categoria: 2, horas_maximas: 12},
    {id: 5, nombre: "Pediátrica", categoria: 3, horas_maximas: 5},
    {id: 6, nombre: "Todoterreno", categoria: 3, horas_maximas: 5},
    {id: 7, nombre: "Ortopédica", categoria: 4, horas_maximas: 8},
    {id: 8, nombre: "Articulada", categoria: 4, horas_maximas: 8},
    {id: 9, nombre: "Macro", categoria: 5, horas_maximas: 17},
    {id: 10, nombre: "Micro", categoria: 5, horas_maximas: 17},
    {id: 11, nombre: "Mascarilla", categoria: 6, horas_maximas: 24},
    {id: 12, nombre: "Intubación", categoria: 6, horas_maximas: 24},
    {id: 13, nombre: "Clásico", categoria: 7, horas_maximas: 9},
    {id: 14, nombre: "Especial", categoria: 7, horas_maximas: 9},
    {id: 15, nombre: "Fisiológico", categoria: 8, horas_maximas: 3},
    {id: 16, nombre: "Glucosado", categoria: 8, horas_maximas: 3},
    {id: 17, nombre: "Algodón", categoria: 9, horas_maximas: 2},
    {id: 18, nombre: "Estériles", categoria: 9, horas_maximas: 2},
    {id: 19, nombre: "Portátil", categoria: 10, horas_maximas: 20},
    {id: 20, nombre: "Especializado", categoria: 10, horas_maximas: 20},
    {id: 21, nombre: "Manual", categoria: 11, horas_maximas: 6},
    {id: 22, nombre: "Fijo", categoria: 11, horas_maximas: 6},
    {id: 23, nombre: "Sutura", categoria: 12, horas_maximas: 15},
    {id: 24, nombre: "Biopsia", categoria: 12, horas_maximas: 15}
];

var recursos = [
    {id: 1, modelo: 1, ubicacion: 1, numero_serie: "M1A001", estado: 0},
    {id: 2, modelo: 1, ubicacion: 2, numero_serie: "M1B002", estado: 1},
    {id: 3, modelo: 2, ubicacion: 3, numero_serie: "M2A003", estado: 0},
    {id: 4, modelo: 2, ubicacion: 4, numero_serie: "M2B004", estado: 2},
    {id: 5, modelo: 3, ubicacion: 5, numero_serie: "M3A005", estado: 0},
    {id: 6, modelo: 3, ubicacion: 6, numero_serie: "M3B006", estado: 1},
    {id: 7, modelo: 4, ubicacion: 7, numero_serie: "M4A007", estado: 0},
    {id: 8, modelo: 4, ubicacion: 1, numero_serie: "M4B008", estado: 2},
    {id: 9, modelo: 5, ubicacion: 2, numero_serie: "M5A009", estado: 0},
    {id: 10, modelo: 5, ubicacion: 3, numero_serie: "M5B010", estado: 1},
    {id: 11, modelo: 6, ubicacion: 4, numero_serie: "M6A011", estado: 0},
    {id: 12, modelo: 6, ubicacion: 5, numero_serie: "M6B012", estado: 2},
    {id: 13, modelo: 7, ubicacion: 6, numero_serie: "M7A013", estado: 0},
    {id: 14, modelo: 7, ubicacion: 7, numero_serie: "M7B014", estado: 1},
    {id: 15, modelo: 8, ubicacion: 1, numero_serie: "M8A015", estado: 0},
    {id: 16, modelo: 8, ubicacion: 2, numero_serie: "M8B016", estado: 2},
    {id: 17, modelo: 9, ubicacion: 3, numero_serie: "M9A017", estado: 0},
    {id: 18, modelo: 9, ubicacion: 4, numero_serie: "M9B018", estado: 1},
    {id: 19, modelo: 10, ubicacion: 5, numero_serie: "M10A019", estado: 0},
    {id: 20, modelo: 10, ubicacion: 6, numero_serie: "M10B020", estado: 2},
    {id: 21, modelo: 11, ubicacion: 7, numero_serie: "M11A021", estado: 0},
    {id: 22, modelo: 11, ubicacion: 1, numero_serie: "M11B022", estado: 1},
    {id: 23, modelo: 12, ubicacion: 2, numero_serie: "M12A023", estado: 0},
    {id: 24, modelo: 12, ubicacion: 3, numero_serie: "M12B024", estado: 2},
    {id: 25, modelo: 13, ubicacion: 4, numero_serie: "M13A025", estado: 0},
    {id: 26, modelo: 13, ubicacion: 5, numero_serie: "M13B026", estado: 1},
    {id: 27, modelo: 14, ubicacion: 6, numero_serie: "M14A027", estado: 0},
    {id: 28, modelo: 14, ubicacion: 7, numero_serie: "M14B028", estado: 2},
    {id: 29, modelo: 15, ubicacion: 1, numero_serie: "M15A029", estado: 0},
    {id: 30, modelo: 15, ubicacion: 2, numero_serie: "M15B030", estado: 1},
    {id: 31, modelo: 16, ubicacion: 3, numero_serie: "M16A031", estado: 0},
    {id: 32, modelo: 16, ubicacion: 4, numero_serie: "M16B032", estado: 2},
    {id: 33, modelo: 17, ubicacion: 5, numero_serie: "M17A033", estado: 0},
    {id: 34, modelo: 17, ubicacion: 6, numero_serie: "M17B034", estado: 1},
    {id: 35, modelo: 18, ubicacion: 7, numero_serie: "M18A035", estado: 0},
    {id: 36, modelo: 18, ubicacion: 1, numero_serie: "M18B036", estado: 2},
    {id: 37, modelo: 19, ubicacion: 2, numero_serie: "M19A037", estado: 0},
    {id: 38, modelo: 19, ubicacion: 3, numero_serie: "M19B038", estado: 1},
    {id: 39, modelo: 20, ubicacion: 4, numero_serie: "M20A039", estado: 0},
    {id: 40, modelo: 20, ubicacion: 5, numero_serie: "M20B040", estado: 2},
    {id: 41, modelo: 21, ubicacion: 6, numero_serie: "M21A041", estado: 0},
    {id: 42, modelo: 21, ubicacion: 7, numero_serie: "M21B042", estado: 1},
    {id: 43, modelo: 22, ubicacion: 1, numero_serie: "M22A043", estado: 0},
    {id: 44, modelo: 22, ubicacion: 2, numero_serie: "M22B044", estado: 2},
    {id: 45, modelo: 23, ubicacion: 3, numero_serie: "M23A045", estado: 0},
    {id: 46, modelo: 23, ubicacion: 4, numero_serie: "M23B046", estado: 1},
    {id: 47, modelo: 24, ubicacion: 5, numero_serie: "M24A047", estado: 0},
    {id: 48, modelo: 24, ubicacion: 6, numero_serie: "M24B048", estado: 2}
];
var siguienteRecurso = recursos.length + 1;

var reservas = [
    {
        id: 1,
        recurso: 5, sanitario: 1, horas_estimadas: 3,
        fecha_peticion: new Date("2026-01-10"),
        fecha_inicio: new Date("2026-01-10"),
        fecha_fin: new Date("2026-01-10")
    },
    {
        id: 2,
        recurso: 12, sanitario: 2, horas_estimadas: 5,
        fecha_peticion: new Date("2026-01-12"),
        fecha_inicio: null,
        fecha_fin: null
    },
    {
        id: 3,
        recurso: 21, sanitario: 3, horas_estimadas: 8,
        fecha_peticion: new Date("2026-01-15"),
        fecha_inicio: new Date("2026-01-15"),
        fecha_fin: null
    },
    {
        id: 4,
        recurso: 30, sanitario: 4, horas_estimadas: 2,
        fecha_peticion: new Date("2026-01-18"),
        fecha_inicio: new Date("2026-01-18"),
        fecha_fin: new Date("2026-01-18")
    },
    {
        id: 5,
        recurso: 9, sanitario: 1, horas_estimadas: 4,
        fecha_peticion: new Date("2026-01-20"),
        fecha_inicio: null,
        fecha_fin: null
    },
    {
        id: 6,
        recurso: 5, sanitario: 2, horas_estimadas: 2,
        fecha_peticion: new Date("2026-01-22"),
        fecha_inicio: null,
        fecha_fin: null
    },
    {
        id: 7,
        recurso: 5, sanitario: 3, horas_estimadas: 6,
        fecha_peticion: new Date("2026-01-23"),
        fecha_inicio: new Date("2026-01-23"),
        fecha_fin: null
    },
    {
        id: 8,
        recurso: 12, sanitario: 4, horas_estimadas: 1,
        fecha_peticion: new Date("2026-01-25"),
        fecha_inicio: new Date("2026-01-25"),
        fecha_fin: new Date("2026-01-25")
    },
    {
        id: 9,
        recurso: 30, sanitario: 2, horas_estimadas: 4,
        fecha_peticion: new Date("2026-01-26"),
        fecha_inicio: null,
        fecha_fin: null
    },
    {
        id: 10,
        recurso: 21, sanitario: 1, horas_estimadas: 3,
        fecha_peticion: new Date("2026-01-27"),
        fecha_inicio: new Date("2026-01-27"),
        fecha_fin: new Date("2026-01-27")
    }
];
var siguienteReserva = reservas.length + 1;

var resenyas = [
    {
        id: 1, recurso: 5, sanitario: 1,
        fecha: new Date("2026-01-10"),
        valor: 5, descripcion: "Funcionó perfectamente y estaba en muy buen estado."
    },
    {
        id: 2, recurso: 30, sanitario: 4,
        fecha: new Date("2026-01-18"),
        valor: 3, descripcion: "Aceptable, aunque necesitaba limpieza."
    },
    {
        id: 3, recurso: 21, sanitario: 3,
        fecha: new Date("2026-01-16"),
        valor: 4, descripcion: "Buen rendimiento, fácil de usar."
    },
    {
        id: 4, recurso: 9, sanitario: 1,
        fecha: new Date("2026-01-21"),
        valor: 2, descripcion: "Tenía pequeños fallos, debería revisarse."
    },
    {
        id: 5, recurso: 5, sanitario: 2,
        fecha: new Date("2026-01-23"),
        valor: 4, descripcion: "Buen estado general."
    }
];
var siguienteResenya = resenyas.length + 1;

module.exports = {
    sanitarios, siguienteSanitario,
    gestores, siguienteGestor,
    ubicaciones,
    categorias,
    modelos,
    recursos, siguienteRecurso,
    reservas, siguienteReserva,
    resenyas, siguienteResenya
};
