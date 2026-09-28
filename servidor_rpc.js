var rpc = require("./rpc.js");

const PORT_RPC = 3501;

// =================================================================
// BASE DE DATOS
// =================================================================

var conexion = require('./conexion_mysql.js');

// =================================================================
// FUNCIONES
// =================================================================

// Obtener datos del sanitario.
function obtenerSanitario(idSanitario, callback) {
    conexion.query("SELECT id, nombre, apellidos, usuario FROM sanitarios WHERE id = " + idSanitario, function (error, sanitarios) {
        if (error) {
            callback(null);
        } else {
            if (sanitarios.length == 0) {
                callback(null);
            } else {
                callback(sanitarios[0]);
            }
        }
    });
}

// Obtener reservas del sanitario logueado.
function obtenerReservas(idSanitario, callback) {
    conexion.query("SELECT * FROM reservas WHERE sanitario = " + idSanitario, function (error, reservas) {
        if (error) {
            callback(null);
        } else {
            callback(reservas);
        }
    });
}

// Login del sanitario
function loginSanitario(usuario, password, callback) {
    conexion.query("SELECT id FROM sanitarios WHERE usuario = '" + usuario + "' AND password = '" + password + "'", function (error, sanitarios) {
        if (error) {
            callback(null);
        } else {
            if (sanitarios.length == 0) {
                callback(null);
            } else {
                callback(sanitarios[0].id);
            }
        }
    });
}

// Registro de un nuevo sanitario
function crearSanitario(nombre, apellidos, usuario, password, callback) {
    conexion.query("SELECT id FROM sanitarios WHERE usuario = '" + usuario + "'", function (error, sanitarios) {
        if (error) {
            callback(null);
        } else {
            if (sanitarios.length > 0) {
                callback(null);
            } else {
                conexion.query("INSERT INTO sanitarios (nombre, apellidos, usuario, password) VALUES ('" + nombre + "','" + apellidos + "','" + usuario + "','" + password + "')", function (error, datos) {
                    if (error) {
                        console.log("Error:", error);
                        callback(null);
                    } else {
                        console.log("Sanitario creado: " + usuario);
                        callback(datos.insertId);
                    }
                });
            }
        }
    });
}

// Obtiener los recursos operativos de un modelo en específico.
function obtenerRecursosFiltrados(idModelo, callback) {
    conexion.query("SELECT recursos.id, recursos.numero_serie, ubicaciones.nombre AS ubicacion_nombre FROM recursos JOIN ubicaciones ON recursos.ubicacion = ubicaciones.id WHERE recursos.modelo = " + idModelo + " AND recursos.estado = 0", function (error, recursos) {
        if (error) {
            callback(null);
        } else {
            conexion.query("SELECT * FROM reservas", function (error, reservas) {
                if (error) {
                    callback(null);
                } else {
                    conexion.query("SELECT * FROM resenyas", function (error, resenyas) {
                        if (error) {
                            callback(null);
                        } else {
                            var resultado = [];

                            for (var i = 0; i < recursos.length; i++) {
                                var rec = recursos[i];
                                var tiempo = calcularTiempoRestante(rec.id, reservas);
                                var media = obtenerMediaRecurso(rec.id, resenyas);

                                var textoValoracion = "Sin valorar";
                                if (media > 0) {
                                    textoValoracion = media.toFixed(1) + " ⭐";
                                }

                                resultado.push({
                                    id: rec.id,
                                    numero_serie: rec.numero_serie,
                                    ubicacion_nombre: rec.ubicacion_nombre,
                                    disponible: tiempo === 0,
                                    valoracion: textoValoracion,
                                    estado_texto: tiempo === 0 ? "Disponible" : "Ocupado (" + tiempo + "h restante)"
                                });
                            }

                            callback(resultado);
                        }
                    });
                }
            });
        }
    });
}
// AUXILIAR: Calcula el tiempo restante de un recurso.
function calcularTiempoRestante(idRecurso, reservas) {
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
function obtenerMediaRecurso(idRecurso, resenyas) {
    var suma = 0;
    var contador = 0;
    for (var i = 0; i < resenyas.length; i++) {
        if (resenyas[i].recurso == idRecurso) {
            suma += resenyas[i].valor;
            contador++;
        }
    }
    return contador > 0 ? (suma / contador) : 0;
}

// Reserva un recurso y lo añade a la base de datos.
function reservarRecurso(datosInput, callback) {
    var fechaInicio = "NULL";
    if (datosInput.retirar) {
        fechaInicio = "NOW()";
    }

    conexion.query("INSERT INTO reservas (recurso, sanitario, horas_estimadas, fecha_peticion, fecha_inicio, fecha_fin) VALUES (" + datosInput.recurso + "," + datosInput.sanitario + "," + datosInput.horas_estimadas + ", NOW(), " + fechaInicio + ", NULL)", function (error, datos) {
        if (error) {
            console.log("Error:", error);
            callback(null);
        } else {
            console.log("RPC: Nueva reserva creada ID " + datos.insertId);
            callback(datos.insertId);
        }
    });
}

// Crea una reseña del sanitario sobre un recurso.
function crearResenya(idRecurso, idSanitario, valor, descripcion, callback) {
    conexion.query("INSERT INTO resenyas (recurso, sanitario, fecha, valor, descripcion) VALUES (" + idRecurso + "," + idSanitario + ", NOW(), " + parseInt(valor) + ",'" + descripcion + "')", function (error, datos) {
        if (error) {
            console.log("Error:", error);
            callback(null);
        } else {
            console.log("RPC: Reseña creada para recurso " + idRecurso);
            callback(datos.insertId);
        }
    });
}

// Iniciar una reserva (retirar recurso)
function iniciarReserva(idReserva, callback) {
    conexion.query("UPDATE reservas SET fecha_inicio = NOW() WHERE id = " + idReserva, function (error, datos) {
        if (error) {
            console.log("Error:", error);
            callback(false);
        } else {
            if (datos.affectedRows == 0) {
                callback(false);
            } else {
                console.log("RPC: Recurso retirado. Reserva " + idReserva + " iniciada.");
                callback(true);
            }
        }
    });
}

// Finalizar una reserva (devolver recurso)
function finalizarReserva(idReserva, callback) {
    conexion.query("UPDATE reservas SET fecha_fin = NOW() WHERE id = " + idReserva, function (error, datos) {
        if (error) {
            console.log("Error:", error);
            callback(false);
        } else {
            if (datos.affectedRows == 0) {
                callback(false);
            } else {
                console.log("RPC: Recurso devuelto. Reserva " + idReserva + " finalizada.");
                callback(true);
            }
        }
    });
}

// Cancelar una reserva.
function cancelarReserva(idReserva, callback) {
    conexion.query("DELETE FROM reservas WHERE id = " + idReserva, function (error, datos) {
        if (error) {
            console.log("Error:", error);
            callback(false);
        } else {
            if (datos.affectedRows == 0) {
                callback(false);
            } else {
                callback(true);
            }
        }
    });
}

// Obtener categorías existentes.
function obtenerCategorias(callback) {
    conexion.query("SELECT * FROM categorias", function (error, categorias) {
        if (error) {
            callback(null);
        } else {
            callback(categorias);
        }
    });
}

// Obtener modelos existentes.
function obtenerModelos(callback) {
    conexion.query("SELECT * FROM modelos", function (error, modelos) {
        if (error) {
            callback(null);
        } else {
            callback(modelos);
        }
    });
}

// Actualiza los datos guardados de un sanitario.
function actualizarSanitario(id, nombre, apellidos, usuario, password, callback) {
    conexion.query("SELECT * FROM sanitarios WHERE id = " + id, function (error, sanitarios) {
        if (error) {
            callback(false);
        } else {
            if (sanitarios.length == 0) {
                callback(false);
            } else {
                var sanitario = sanitarios[0];

                // Si un campo no llega, se mantiene el valor actual.
                if (!nombre) nombre = sanitario.nombre;
                if (!apellidos) apellidos = sanitario.apellidos;
                if (!usuario) usuario = sanitario.usuario;
                if (!password) password = sanitario.password;

                conexion.query("SELECT id FROM sanitarios WHERE usuario = '" + usuario + "' AND id <> " + id, function (error, repetidos) {
                    if (error) {
                        callback(false);
                    } else {
                        if (repetidos.length > 0) {
                            callback(false);
                        } else {
                            conexion.query("UPDATE sanitarios SET nombre = '" + nombre + "', apellidos = '" + apellidos + "', usuario = '" + usuario + "', password = '" + password + "' WHERE id = " + id, function (error, datos) {
                                if (error) {
                                    console.log("Error:", error);
                                    callback(false);
                                } else {
                                    callback(true);
                                }
                            });
                        }
                    }
                });
            }
        }
    });
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