var rpc = require("./rpc.js");
var datos = require("./datos.js");

const PORT_RPC = 3501;

// =================================================================
// FUNCIONES
// =================================================================

// Obtener datos del sanitario.
function obtenerSanitario(idSanitario, callback) {
    for (var i = 0; i < datos.sanitarios.length; i++) {
        if (datos.sanitarios[i].id == idSanitario) {
            var s = {
                id: datos.sanitarios[i].id,
                nombre: datos.sanitarios[i].nombre,
                apellidos: datos.sanitarios[i].apellidos,
                usuario: datos.sanitarios[i].usuario
            };
            return callback(s);
        }
    }
    return callback(null);
}

// Obtener reservas del sanitario logueado.
function obtenerReservas(idSanitario, callback) {
    var resultado = [];
    for (var i = 0; i < datos.reservas.length; i++) {
        if (datos.reservas[i].sanitario == idSanitario) {
            resultado.push(datos.reservas[i]);
        }
    }
    return callback(resultado);
}

// Login del sanitario
function loginSanitario(usuario, password, callback) {
    for (var i = 0; i < datos.sanitarios.length; i++) {
        if (datos.sanitarios[i].usuario === usuario && datos.sanitarios[i].password === password) {
            return callback(datos.sanitarios[i].id);
        }
    }
    return callback(null);
}

// Registro de un nuevo sanitario
function crearSanitario(nombre, apellidos, usuario, password, callback) {

    for (var i = 0; i < datos.sanitarios.length; i++) {
        if (datos.sanitarios[i].usuario === usuario){
            return callback(null);
        } 
    }

    var id = datos.siguienteSanitario;
    datos.siguienteSanitario++;
    
    var nuevo = {
        id: id,
        nombre: nombre,
        apellidos: apellidos,
        usuario: usuario,
        password: password
    };
    
    datos.sanitarios.push(nuevo);
    console.log("Sanitario creado: " + usuario);
    return callback(id);
}

// Obtiener los recursos operativos de un modelo en específico.
function obtenerRecursosFiltrados(idModelo, callback) {
    var resultado = [];
    var recursos = datos.recursos;

    for (var i = 0; i < recursos.length; i++) {
        if (recursos[i].modelo == idModelo && recursos[i].estado == 0) {
            var rec = recursos[i];
            var tiempo = calcularTiempoRestante(rec.id);
            var media = obtenerMediaRecurso(rec.id);

            var textoValoracion = "Sin valorar";
            if (media > 0) {
                textoValoracion = media.toFixed(1) + " ⭐";
            }

            resultado.push({
                id: rec.id,
                numero_serie: rec.numero_serie,
                ubicacion_nombre: obtenerNombreUbicacion(rec.ubicacion),
                disponible: tiempo === 0,
                valoracion: textoValoracion,
                estado_texto: tiempo === 0 ? "Disponible" : "Ocupado (" + tiempo + "h restante)"
            });
        }
    }
    return callback(resultado);
}
// AUXILIAR: Obtiene el nombre de una ubicación a partir de su ID.
function obtenerNombreUbicacion(idUbicacion) {
    for (var i = 0; i < datos.ubicaciones.length; i++) {
        if (datos.ubicaciones[i].id == idUbicacion) return datos.ubicaciones[i].nombre;
    }
    return "Desconocida";
}
// AUXILIAR: Calcula el tiempo restante de un recurso.
function calcularTiempoRestante(idRecurso) {
    var reservas = datos.reservas;
    var ahora = new Date();
    var tiempoTotal = 0;

    for (var i = 0; i < reservas.length; i++) {
        var res = reservas[i];
        if (res.recurso == idRecurso) {
            
            if (res.fecha_inicio && !res.fecha_fin) {
                var transcurridoMs = ahora - new Date(res.fecha_inicio);
                var transcurridoHoras = transcurridoMs / (1000 * 60 * 60);
                var restante = res.horas_estimadas - transcurridoHoras;
                if (restante > 0) tiempoTotal += restante;
            }
            
            if (!res.fecha_inicio && !res.fecha_fin) {
                tiempoTotal += res.horas_estimadas;
            }
        }
    }
    
    return Math.max(0, Math.round(tiempoTotal * 10) / 10);
}
// AUXILIAR. Obtiene la valoración media de un recurso.
function obtenerMediaRecurso(idRecurso) {
    var suma = 0;
    var contador = 0;
    for (var i = 0; i < datos.resenyas.length; i++) {
        if (datos.resenyas[i].recurso == idRecurso) {
            suma += datos.resenyas[i].valor;
            contador++;
        }
    }
    return contador > 0 ? (suma / contador) : 0;
}


// Reserva un recurso y lo añade a la base de datos.
function reservarRecurso(datosInput, callback) {

    var id = datos.siguienteReserva;
    datos.siguienteReserva++;

    var nueva = {
        id: id,
        recurso: datosInput.recurso,
        sanitario: datosInput.sanitario,
        horas_estimadas: datosInput.horas_estimadas,
        fecha_peticion: new Date(),
        fecha_inicio: datosInput.retirar ? new Date() : null,
        fecha_fin: null
    };

    datos.reservas.push(nueva);
    console.log("RPC: Nueva reserva creada ID " + id);
    return callback(id);
}


// Crea una reseña del sanitario sobre un recurso.
function crearResenya(idRecurso, idSanitario, valor, descripcion, callback) {
    var id = datos.siguienteResenya;
    datos.siguienteResenya++;

    var nueva = {
        id: id,
        recurso: idRecurso,
        sanitario: idSanitario,
        fecha: new Date(),
        valor: parseInt(valor),
        descripcion: descripcion
    };

    datos.resenyas.push(nueva);
    console.log("RPC: Reseña creada para recurso " + idRecurso);
    return callback(id);
}


// Iniciar una reserva (retirar recurso)
function iniciarReserva(idReserva, callback) {
    for (var i = 0; i < datos.reservas.length; i++) {
        if (datos.reservas[i].id == idReserva) {
            datos.reservas[i].fecha_inicio = new Date(); 
            console.log("RPC: Recurso retirado. Reserva " + idReserva + " iniciada.");
            return callback(true);
        }
    }
    return callback(false);
}

// Finalizar una reserva (devolver recurso)
function finalizarReserva(idReserva, callback) {
    for (var i = 0; i < datos.reservas.length; i++) {
        if (datos.reservas[i].id == idReserva) {
            datos.reservas[i].fecha_fin = new Date();
            console.log("RPC: Recurso devuelto. Reserva " + idReserva + " finalizada.");
            return callback(true);
        }
    }
    return callback(false);
}


// Cancelar una reserva.
function cancelarReserva(idReserva, callback) {
    for (var i = 0; i < datos.reservas.length; i++) {
        if (datos.reservas[i].id == idReserva) {
            datos.reservas.splice(i, 1);
            return callback(true);
        }
    }
    return callback(false);
}

// Obtener categorías existentes.
function obtenerCategorias(callback) {
    return callback(datos.categorias);
}

// Obtener modelos existentes.
function obtenerModelos(callback) {
    return callback(datos.modelos);
}

// Actualiza los datos guardados de un sanitario.
function actualizarSanitario(id, nombre, apellidos, usuario, password, callback) {

    for (var i = 0; i < datos.sanitarios.length; i++) {
        if (datos.sanitarios[i].usuario === usuario && datos.sanitarios[i].id != id) {
            return callback(false);
        }
    }

    for (var i = 0; i < datos.sanitarios.length; i++) {
        if (datos.sanitarios[i].id == id) {
            if (nombre)    datos.sanitarios[i].nombre    = nombre;
            if (apellidos) datos.sanitarios[i].apellidos = apellidos;
            if (usuario)   datos.sanitarios[i].usuario   = usuario;
            if (password)  datos.sanitarios[i].password  = password;
            return callback(true);
        }
    }
    return callback(false);
}

// =================================================================
// LANZAMIENTO DEL SERVIDOR
// =================================================================

var servidor = rpc.server(); // Puerto 3501 por defecto
var app = servidor.createApp("hospital_rpc");

// Registro de todas las funciones los procedimientos
app.registerAsync(obtenerSanitario);
app.registerAsync(obtenerReservas);
app.registerAsync(loginSanitario);
app.registerAsync(crearSanitario);
app.registerAsync(obtenerRecursosFiltrados);
app.registerAsync(reservarRecurso);
app.registerAsync(crearResenya);
app.registerAsync(iniciarReserva);
app.registerAsync(finalizarReserva);
app.registerAsync(cancelarReserva);
app.registerAsync(obtenerCategorias);
app.registerAsync(obtenerModelos);
app.registerAsync(actualizarSanitario);

console.log("-----------------------------------------");
console.log("Servidor RPC ejecutándose en puerto: " + PORT_RPC);
console.log("-----------------------------------------");