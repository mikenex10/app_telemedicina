const { WebSocketServer } = require("ws");

const PORT_WS = 3502;

// Array de clientes para almacenar los parámetros necesario.s
const clientes = new Map();

const wss = new WebSocketServer({ port: PORT_WS });

// =================================================================
// BASE DE DATOS
// =================================================================

var conexion = require('./conexion_mysql.js');

// =================================================================
// FUNCIONES
// =================================================================

wss.on("connection", function (ws) {

    ws.on("message", function (raw) {

        var msg = JSON.parse(raw);

        if (msg.tipo === "registro") {
            clientes.set(ws, {rol: msg.rol, id: msg.id});
            return;
        }

        if (msg.tipo === "reservaActualizada") {
            var infoCliente = clientes.get(ws);
            if (!infoCliente || infoCliente.rol !== "sanitario") return;

            var idRecurso = msg.idRecurso;

            obtenerInfoRecurso(idRecurso, function (infoRecurso) {

                // Nombre del sanitario que provocó la acción
                obtenerNombreSanitario(infoCliente.id, function (nombreOrigen) {

                    // Reservas sin finalizar del mismo recurso
                    conexion.query("SELECT sanitario FROM reservas WHERE recurso = " + idRecurso + " AND fecha_fin IS NULL", function (error, reservasActivas) {
                        if (error) {
                            console.log("Error:", error);
                        } else {
                            var textoAviso = msg.accion === "iniciada"
                                ? "SE HA INICIADO LA RESERVA DEL " + infoRecurso.texto
                                : "SE HA FINALIZADO LA RESERVA DEL " + infoRecurso.texto;

                            var aviso = {
                                tipo: "aviso",
                                color: "rojo",
                                fecha: new Date().toISOString(),
                                origen: nombreOrigen,
                                texto: textoAviso
                            };

                            // Enviar solo a sanitarios con reserva activa (sin fecha_fin) del mismo recurso
                            clientes.forEach(function (info, clienteWs) {
                                if (clienteWs === ws) return;
                                if (info.rol !== "sanitario") return;
                                if (!tieneReservaActiva(info.id, reservasActivas)) return;
                                if (clienteWs.readyState === 1) {
                                    clienteWs.send(JSON.stringify(aviso));
                                }
                            });
                        }
                    });
                });
            });
            return;
        }

        if (msg.tipo === "nuevoRecurso") {
            var infoCliente = clientes.get(ws);
            if (!infoCliente || infoCliente.rol !== "gestor") return;

            var idRecurso = msg.idRecurso;

            obtenerInfoRecurso(idRecurso, function (infoRecurso) {
                obtenerNombreGestor(infoCliente.id, function (nombreOrigen) {

                    var aviso = {
                        tipo: "aviso",
                        color: "azul",
                        fecha: new Date().toISOString(),
                        origen: nombreOrigen,
                        texto: "SE HA CREADO UN NUEVO RECURSO " + infoRecurso.texto
                    };

                    // Enviar a todos los sanitarios conectados
                    clientes.forEach(function (info, clienteWs) {
                        if (info.rol !== "sanitario") return;
                        if (clienteWs.readyState === 1) {
                            clienteWs.send(JSON.stringify(aviso));
                        }
                    });
                });
            });
            return;
        }

        if (msg.tipo === "nuevaResenya") {
            var infoCliente = clientes.get(ws);
            if (!infoCliente || infoCliente.rol !== "sanitario") return;

            var idRecurso = msg.idRecurso;

            obtenerInfoRecurso(idRecurso, function (infoRecurso) {
                obtenerNombreSanitario(infoCliente.id, function (nombreOrigen) {

                    var aviso = {
                        tipo: "aviso",
                        color: "verde",
                        fecha: new Date().toISOString(),
                        origen: nombreOrigen,
                        texto: "SE HA CREADO UNA RESEÑA PARA " + infoRecurso.texto + " Y PUNTUACIÓN " + msg.puntuacion
                    };

                    // Enviar a todos los gestores conectados
                    clientes.forEach(function (info, clienteWs) {
                        if (info.rol !== "gestor") return;
                        if (clienteWs.readyState === 1) {
                            clienteWs.send(JSON.stringify(aviso));
                        }
                    });
                });
            });
            return;
        }

        console.log("WS: Tipo de mensaje desconocido:", msg.tipo);
    });

    ws.on("close", function () {
        clientes.delete(ws);
        console.log("WS: Conexión cerrada. Clientes activos:", clientes.size);
    });

    ws.on("error", function (err) {
        console.error("WS: Error en conexión:", err.message);
        clientes.delete(ws);
    });
});

console.log("-----------------------------------------");
console.log("Servidor WS ejecutándose en puerto: " + PORT_WS);
console.log("-----------------------------------------");

// =================================================================
// FUNCIONES AUXILIARES
// =================================================================

// Construye el texto descriptivo del recurso para el aviso.
function obtenerInfoRecurso(idRecurso, callback) {
    conexion.query("SELECT recursos.numero_serie, modelos.nombre AS modelo, categorias.nombre AS categoria FROM recursos JOIN modelos ON recursos.modelo = modelos.id JOIN categorias ON modelos.categoria = categorias.id WHERE recursos.id = " + idRecurso, function (error, recursos) {
        if (error) {
            callback({ texto: "RECURSO DESCONOCIDO" });
        } else {
            if (recursos.length == 0) {
                callback({ texto: "RECURSO DESCONOCIDO" });
            } else {
                var recurso = recursos[0];
                callback({
                    texto: recurso.categoria.toUpperCase() + " MODELO " + recurso.modelo.toUpperCase() + " CON CÓDIGO " + recurso.numero_serie.toUpperCase()
                });
            }
        }
    });
}

// Comprueba si un sanitario está entre las reservas activas (sin finalizar) de un recurso.
function tieneReservaActiva(idSanitario, reservasActivas) {
    for (var i = 0; i < reservasActivas.length; i++) {
        if (reservasActivas[i].sanitario == idSanitario) {
            return true;
        }
    }
    return false;
}

// Devuelve el nombre completo de un sanitario.
function obtenerNombreSanitario(idSanitario, callback) {
    conexion.query("SELECT nombre, apellidos FROM sanitarios WHERE id = " + idSanitario, function (error, sanitarios) {
        if (error) {
            callback("Sanitario desconocido");
        } else {
            if (sanitarios.length == 0) {
                callback("Sanitario desconocido");
            } else {
                callback(sanitarios[0].nombre + " " + sanitarios[0].apellidos);
            }
        }
    });
}

// Devuelve el nombre completo de un gestor.
function obtenerNombreGestor(idGestor, callback) {
    conexion.query("SELECT nombre, apellidos FROM gestores WHERE id = " + idGestor, function (error, gestores) {
        if (error) {
            callback("Gestor desconocido");
        } else {
            if (gestores.length == 0) {
                callback("Gestor desconocido");
            } else {
                callback(gestores[0].nombre + " " + gestores[0].apellidos);
            }
        }
    });
}