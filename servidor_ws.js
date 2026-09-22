const { WebSocketServer } = require("ws");
const datos = require("./datos.js");

const PORT_WS = 3502;

// Array de clientes para almacenar los parámetros necesario.s
const clientes = new Map();

const wss = new WebSocketServer({ port: PORT_WS });

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

            var infoRecurso = obtenerInfoRecurso(idRecurso);

            // Nombre del sanitario que provocó la acción
            var nombreOrigen = obtenerNombreSanitario(infoCliente.id);

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
                if (!tieneReservaActiva(info.id, idRecurso)) return;
                if (clienteWs.readyState === 1) {
                    clienteWs.send(JSON.stringify(aviso));
                }
            });
            return;
        }

        if (msg.tipo === "nuevoRecurso") {
            var infoCliente = clientes.get(ws);
            if (!infoCliente || infoCliente.rol !== "gestor") return;

            var idRecurso = msg.idRecurso;
            var infoRecurso = obtenerInfoRecurso(idRecurso);
            var nombreOrigen = obtenerNombreGestor(infoCliente.id);

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
            return;
        }

        if (msg.tipo === "nuevaResenya") {
            var infoCliente = clientes.get(ws);
            if (!infoCliente || infoCliente.rol !== "sanitario") return;

            var idRecurso = msg.idRecurso;
            var infoRecurso = obtenerInfoRecurso(idRecurso);
            var nombreOrigen = obtenerNombreSanitario(infoCliente.id);

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
function obtenerInfoRecurso(idRecurso) {
    var recurso = null;
    for (var i = 0; i < datos.recursos.length; i++) {
        if (datos.recursos[i].id == idRecurso) {
            recurso = datos.recursos[i];
            break;
        }
    }
    if (!recurso) return { texto: "RECURSO DESCONOCIDO" };

    var modelo = null;
    for (var i = 0; i < datos.modelos.length; i++) {
        if (datos.modelos[i].id == recurso.modelo) {
            modelo = datos.modelos[i];
            break;
        }
    }

    var categoria = null;
    if (modelo) {
        for (var i = 0; i < datos.categorias.length; i++) {
            if (datos.categorias[i].id == modelo.categoria) {
                categoria = datos.categorias[i];
                break;
            }
        }
    }

    var nombreCategoria = categoria ? categoria.nombre.toUpperCase() : "RECURSO";
    var nombreModelo = modelo ? modelo.nombre : "DESCONOCIDO";
    var serie = recurso.numero_serie;

    return {
        texto: nombreCategoria + " MODELO " + nombreModelo + " CON CÓDIGO " + serie
    };
}

// Comprueba si un sanitario tiene alguna reserva activa (iniciada, no finalizada) de un recurso.
function tieneReservaActiva(idSanitario, idRecurso) {
    for (var i = 0; i < datos.reservas.length; i++) {
        var r = datos.reservas[i];
        if (r.sanitario == idSanitario && r.recurso == idRecurso && r.fecha_fin == null) {
            return true;
        }
    }
    return false;
}

// Devuelve el nombre completo de un sanitario.
function obtenerNombreSanitario(idSanitario) {
    for (var i = 0; i < datos.sanitarios.length; i++) {
        if (datos.sanitarios[i].id == idSanitario) {
            return datos.sanitarios[i].nombre + " " + datos.sanitarios[i].apellidos;
        }
    }
    return "Sanitario desconocido";
}

// Devuelve el nombre completo de un gestor.
function obtenerNombreGestor(idGestor) {
    for (var i = 0; i < datos.gestores.length; i++) {
        if (datos.gestores[i].id == idGestor) {
            return datos.gestores[i].nombre + " " + datos.gestores[i].apellidos;
        }
    }
    return "Gestor desconocido";
}