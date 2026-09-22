// =================================================================
// BASE DE DATOS
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
    {id: 1, nombre: "Almacén 1"},
    {id: 2, nombre: "Almacén 2"},
    {id: 3, nombre: "Quirófano"},
    {id: 4, nombre: "Laboratorio"}
];

var categorias = [
    {id: 1, nombre: "Termómetro"},
    {id: 2, nombre: "Estetoscopio"},
    {id: 3, nombre: "Silla de ruedas"},
    {id: 4, nombre: "Espirómetro"},
    {id: 5, nombre: "Bisturí"}
];

var modelos = [
    {id: 1, nombre: "TERM-460", categoria: 1, horas_maximas: 4},
    {id: 2, nombre: "TERM-600", categoria: 1, horas_maximas: 4},
    {id: 3, nombre: "EST-900", categoria: 2, horas_maximas: 6},
    {id: 4, nombre: "EST-950", categoria: 2, horas_maximas: 6},
    {id: 5, nombre: "EST-999", categoria: 2, horas_maximas: 6},
    {id: 6, nombre: "SR-XL", categoria: 3, horas_maximas: 24},
    {id: 7, nombre: "SR-XXL", categoria: 3, horas_maximas: 24},
    {id: 8, nombre: "ESP-MANUAL", categoria: 4, horas_maximas: 12},
    {id: 9, nombre: "ESP-AUTO", categoria: 4, horas_maximas: 12},
    {id: 10, nombre: "BIST-ELEC", categoria: 5, horas_maximas: 10},
    {id: 11, nombre: "BIST-TRAD", categoria: 5, horas_maximas: 10}
];

var recursos = [
    {id: 1, modelo: 1, ubicacion: 1, numero_serie: "SN48001", estado: 0},
    {id: 2, modelo: 3, ubicacion: 2, numero_serie: "SN46554", estado: 0},
    {id: 3, modelo: 6, ubicacion: 3, numero_serie: "SN22340", estado: 0},
    {id: 4, modelo: 8, ubicacion: 2, numero_serie: "SSN11002", estado: 0},
    {id: 5, modelo: 10, ubicacion: 1, numero_serie: "SN49600", estado: 0}
];
var siguienteRecurso = recursos.length + 1;

var reservas = [
    {
        id: 1,
        recurso: 1, sanitario: 1, horas_estimadas: 2,
        fecha_peticion: haceDias(2),
        fecha_inicio: sumarMin(haceDias(2), 30),
        fecha_fin: sumarHoras(haceDias(2), 2.5)
    },
    {
        id: 2,
        recurso: 1, sanitario: 2, horas_estimadas: 3,
        fecha_peticion: haceDias(1),
        fecha_inicio: sumarMin(haceDias(1), 15),
        fecha_fin: sumarHoras(haceDias(1), 3)
    },
    {
        id: 3,
        recurso: 1, sanitario: 3, horas_estimadas: 4,
        fecha_peticion: haceMin(30),
        fecha_inicio: haceMin(20),
        fecha_fin: null
    },
    {
        id: 4,
        recurso: 1, sanitario: 4, horas_estimadas: 2,
        fecha_peticion: haceMin(10),
        fecha_inicio: null,
        fecha_fin: null
    },
    {
        id: 5,
        recurso: 2, sanitario: 4, horas_estimadas: 2,
        fecha_peticion: haceDias(2),
        fecha_inicio: sumarMin(haceDias(2), 10),
        fecha_fin: sumarHoras(haceDias(2), 2)
    },
    {
        id: 6,
        recurso: 2, sanitario: 1, horas_estimadas: 1,
        fecha_peticion: haceHoras(5),
        fecha_inicio: haceHoras(4),
        fecha_fin: null
    },
    {
        id: 7,
        recurso: 3, sanitario: 2, horas_estimadas: 8,
        fecha_peticion: haceDias(2),
        fecha_inicio: sumarMin(haceDias(2), 30),
        fecha_fin: sumarHoras(haceDias(2), 8)
    },
    {
        id: 8,
        recurso: 3, sanitario: 3, horas_estimadas: 12,
        fecha_peticion: haceHoras(2),
        fecha_inicio: haceHoras(1),
        fecha_fin: null
    },
    {
        id: 9,
        recurso: 3, sanitario: 1, horas_estimadas: 6,
        fecha_peticion: haceMin(15),
        fecha_inicio: null,
        fecha_fin: null
    },
    {
        id: 10,
        recurso: 4, sanitario: 3, horas_estimadas: 3,
        fecha_peticion: haceDias(1),
        fecha_inicio: sumarMin(haceDias(1), 20),
        fecha_fin: sumarHoras(haceDias(1), 3)
    },
    {
        id: 11,
        recurso: 4, sanitario: 4, horas_estimadas: 2,
        fecha_peticion: sumarHoras(haceDias(1), 4),
        fecha_inicio: sumarMin(sumarHoras(haceDias(1), 4), 5),
        fecha_fin: sumarHoras(haceDias(1), 6)
    },
    {
        id: 12,
        recurso: 4, sanitario: 2, horas_estimadas: 4,
        fecha_peticion: haceMin(5),
        fecha_inicio: null,
        fecha_fin: null
    },
    {
        id: 13,
        recurso: 5, sanitario: 1, horas_estimadas: 2,
        fecha_peticion: haceDias(2),
        fecha_inicio: sumarMin(haceDias(2), 10),
        fecha_fin: sumarHoras(haceDias(2), 2)
    },
    {
        id: 14,
        recurso: 5, sanitario: 4, horas_estimadas: 1,
        fecha_peticion: haceHoras(3),
        fecha_inicio: haceHoras(3),
        fecha_fin: null
    },
    {
        id: 15,
        recurso: 5, sanitario: 3, horas_estimadas: 2,
        fecha_peticion: haceMin(2),
        fecha_inicio: null,
        fecha_fin: null
    }
];
var siguienteReserva = reservas.length + 1;

var resenyas = [
    {
        id: 1, recurso: 1, sanitario: 1,
        fecha: sumarHoras(haceDias(2), 3),
        valor: 5, descripcion: "Todo en orden, gracias"
    },
    {
        id: 2, recurso: 1, sanitario: 2,
        fecha: sumarHoras(haceDias(1), 3),
        valor: 4, descripcion: "Muy buen termómetro, wow."
    },
    {
        id: 3, recurso: 2, sanitario: 4,
        fecha: sumarHoras(haceDias(2), 3),
        valor: 3, descripcion: "Correcto pero casi no se escucha"
    },
    {
        id: 4, recurso: 3, sanitario: 2,
        fecha: sumarHoras(haceDias(2), 9),
        valor: 5, descripcion: "Es muy cómoda, va genial"
    },
    {
        id: 5, recurso: 4, sanitario: 3,
        fecha: sumarHoras(haceDias(1), 4),
        valor: 4, descripcion: "Tarda mucho en arrancar pero el resto va bien."
    },
    {
        id: 6, recurso: 4, sanitario: 4,
        fecha: sumarHoras(haceDias(1), 7),
        valor: 2, descripcion: "Se quedó sin bateria en medio de una prueba..."
    },
    {
        id: 7, recurso: 5, sanitario: 1,
        fecha: sumarHoras(haceDias(2), 3),
        valor: 5, descripcion: "Corte limpio y preciso, excelente"
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
