var express = require("express");
var app = express();

const PORT_REST = 3000;

app.use("/appCliente", express.static("cliente_rest")); 
app.use(express.json()); 

// =================================================================
// BASE DE DATOS
// =================================================================

var datos = require("./datos.js");
var sanitarios = datos.sanitarios;
var gestores = datos.gestores;
var ubicaciones = datos.ubicaciones;
var categorias = datos.categorias;
var modelos = datos.modelos;
var recursos = datos.recursos;
var reservas = datos.reservas;
var resenyas = datos.resenyas;

// =================================================================
// OPERACIONES
// =================================================================

// Consulta simple para ubicaciones.
app.get("/api/ubicaciones", function (req, res) {
    res.status(200).json(ubicaciones);
});

// Consulta simple para categorias.
app.get("/api/categorias", function (req, res) {
    res.status(200).json(categorias);
});

// Consulta simple para modelos.
app.get("/api/modelos", function (req, res) {
    res.status(200).json(modelos);
});

// Autentificación de gestores.
app.post("/api/gestores/login", function (req, res) {
    console.log(req.body);

    var usuario = req.body.usuario;
    var password = req.body.password;

    if (!usuario || !password) {
        res.status(403).json("Faltan credenciales");
        return;
    };

    for (var i = 0; i < gestores.length; i++) {
        if (gestores[i].usuario === usuario && gestores[i].password === password) {
            res.status(200).json(gestores[i].id);
            return;
        };
    };

    res.status(403).json("Credenciales incorrectas");

});

// Registro de nuevo gestor.
app.post("/api/gestores", function (req, res) {
    console.log(req.body);

    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;
    var usuario = req.body.usuario;
    var password = req.body.password;

    if (!nombre || !apellidos || !usuario || !password) {
        res.status(403).json("Faltan datos obligatorios");
        return;
    };

    for (var i = 0; i < gestores.length; i++) {
        if (gestores[i].usuario === usuario) {
            res.status(403).json("El usuario ya existe");
            return;
        };
    };

    var nuevoGestor = {
        id: datos.siguienteGestor,
        nombre: nombre,
        apellidos: apellidos,
        usuario: usuario,
        password: password
    };

    console.log(nuevoGestor);
    gestores.push(nuevoGestor);
    datos.siguienteGestor++;

    res.status(201).json(nuevoGestor.id);

});

// Actualizar gestor ya existente.
app.put("/api/gestores/:id", function (req, res) {

    var id = req.params.id;

    var gestor = null;

    for (var i = 0; i < gestores.length; i++) {
        if (gestores[i].id == id) {
            gestor = gestores[i];
            break;
        }
    }

    if (!gestor) {
        res.status(404).json("Gestor no encontrado");
        return;
    }

    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;
    var usuario = req.body.usuario;
    var password = req.body.password;

    if (usuario && usuario !== gestor.usuario) {

        for (var i = 0; i < gestores.length; i++) {
            if (gestores[i].usuario === usuario) {
                res.status(403).json("El usuario ya existe");
                return;
            }
        }
    }

    if (nombre) gestor.nombre = nombre;
    if (apellidos) gestor.apellidos = apellidos;
    if (usuario) gestor.usuario = usuario;
    if (password) gestor.password = password;

    res.status(200).json("Gestor actualizado correctamente");

});

// Obtener un gestor mediante su ID.
app.get("/api/gestores/:id", function (req, res) {

    var id = req.params.id;

    for (var i = 0; i < gestores.length; i++) {

        if (gestores[i].id == id) {

            var gestorSinPassword = {
                id: gestores[i].id,
                nombre: gestores[i].nombre,
                apellidos: gestores[i].apellidos,
                usuario: gestores[i].usuario
            };

            res.status(200).json(gestorSinPassword);
            return;
        }
    }

    res.status(404).json("Gestor no encontrado");

});

// Contar sanitarios que tienen más de una reserva realizada (EXAMEN).
app.get("/api/sanitarios/variasReservas", function (req, res) {

    var contadorPorSanitario = {};

    for (var i = 0; i < reservas.length; i++) {
        var idSanitario = reservas[i].sanitario;

        if (contadorPorSanitario[idSanitario] === undefined) {
            contadorPorSanitario[idSanitario] = 1;
        } else {
            contadorPorSanitario[idSanitario]++;
        }
    }

    var sanitariosConVarias = 0;

    for (var id in contadorPorSanitario) {
        if (contadorPorSanitario[id] > 1) {
            sanitariosConVarias++;
        }
    }

    res.status(200).json(sanitariosConVarias);
});

// Obtener un sanitario mediante su ID.
app.get("/api/sanitarios/:id", function (req, res) {

    var id = req.params.id;

    for (var i = 0; i < sanitarios.length; i++) {

        if (sanitarios[i].id == id) {

            var sanitarioSinPassword = {
                id: sanitarios[i].id,
                nombre: sanitarios[i].nombre,
                apellidos: sanitarios[i].apellidos,
                usuario: sanitarios[i].usuario
            };

            res.status(200).json(sanitarioSinPassword);
            return;
        }
    }

    res.status(404).json("Sanitario no encontrado");

});

// Obtener recursos con filtro opcional.
app.get("/api/recursos", function (req, res) {

    var categoria = req.query.categoria;
    var modelo = req.query.modelo;
    var ubicacion = req.query.ubicacion;
    var estado = req.query.estado;

    var resultado = [];

    for (var i = 0; i < recursos.length; i++) {

        if (modelo !== undefined && modelo !== "" && recursos[i].modelo != modelo) {
            continue;
        }

        if (ubicacion !== undefined && ubicacion !== "" && recursos[i].ubicacion != ubicacion) {
            continue;
        }

        if (estado !== undefined && estado !== "" && recursos[i].estado != estado) {
            continue;
        }

        if (categoria !== undefined && categoria !== "") {

            var modeloDelRecurso = null;
            for (var j = 0; j < modelos.length; j++) {
                if (modelos[j].id == recursos[i].modelo) {
                    modeloDelRecurso = modelos[j];
                    break;
                }
            }

            if (modeloDelRecurso == null) {
                continue;
            }

            if (modeloDelRecurso.categoria != categoria) {
                continue;
            }
        }

        resultado.push(recursos[i]);
    }

    res.status(200).json(resultado);

});

// Obtener recurso mediante su ID.
app.get("/api/recursos/:id", function (req, res) {

    var id = req.params.id;

    for (var i = 0; i < recursos.length; i++) {

        if (recursos[i].id == id) {

            res.status(200).json(recursos[i]);
            return;
        }
    }

    res.status(404).json("Recurso no encontrado");

});

// Registro de nuevo recurso.
app.post("/api/recursos", function (req, res) {

    var modelo = req.body.modelo;
    var ubicacion = req.body.ubicacion;
    var numero_serie = req.body.numero_serie;
    var estado = req.body.estado;

    if (modelo === undefined || ubicacion === undefined || !numero_serie || estado === undefined) {
        res.status(403).json("Faltan datos obligatorios");
        return;
    }

    var existeModelo = false;
    for (var i = 0; i < modelos.length; i++) {
        if (modelos[i].id == modelo) {
            existeModelo = true;
            break;
        }
    }

    if (!existeModelo) {
        res.status(403).json("El modelo no existe");
        return;
    }

    var existeUbicacion = false;
    for (var i = 0; i < ubicaciones.length; i++) {
        if (ubicaciones[i].id == ubicacion) {
            existeUbicacion = true;
            break;
        }
    }

    if (!existeUbicacion) {
        res.status(403).json("La ubicación no existe");
        return;
    }

    var nuevoRecurso = {
        id: datos.siguienteRecurso,
        modelo: modelo,
        ubicacion: ubicacion,
        numero_serie: numero_serie,
        estado: estado
    };

    recursos.push(nuevoRecurso);
    datos.siguienteRecurso++;

    res.status(201).json(nuevoRecurso.id);

});

// Actualizar recurso mediante su ID.
app.put("/api/recursos/:id", function (req, res) {

    var id = req.params.id;

    var modelo = req.body.modelo;
    var ubicacion = req.body.ubicacion;
    var numero_serie = req.body.numero_serie;
    var estado = req.body.estado;

    for (var i = 0; i < recursos.length; i++) {

        if (recursos[i].id == id) {

            if (modelo !== undefined) {
                var existeModelo = false;
                for (var j = 0; j < modelos.length; j++) {
                    if (modelos[j].id == modelo) {
                        existeModelo = true;
                        break;
                    }
                }
                if (!existeModelo) {
                    res.status(403).json("El modelo no existe");
                    return;
                }
            }

            if (ubicacion !== undefined) {
                var existeUbicacion = false;
                for (var j = 0; j < ubicaciones.length; j++) {
                    if (ubicaciones[j].id == ubicacion) {
                        existeUbicacion = true;
                        break;
                    }
                }
                if (!existeUbicacion) {
                    res.status(403).json("La ubicación no existe");
                    return;
                }
            }

            if (modelo !== undefined) recursos[i].modelo = modelo;
            if (ubicacion !== undefined) recursos[i].ubicacion = ubicacion;
            if (numero_serie !== undefined && numero_serie !== "") recursos[i].numero_serie = numero_serie;

            if (estado !== undefined) recursos[i].estado = estado;

            res.status(200).json("Recurso actualizado");
            return;
        }
    }

    res.status(404).json("Recurso no encontrado");

});

// Eliminar recurso mediante su ID.
app.delete("/api/recursos/:id", function (req, res) {

    var id = req.params.id;

    for (var i = 0; i < recursos.length; i++) {

        if (recursos[i].id == id) {

            recursos.splice(i, 1);

            res.status(200).json("Recurso eliminado");
            return;
        }
    }

    res.status(404).json("Recurso no encontrado");

});

// Obtener las reservas de un recurso mediante su ID.
app.get("/api/recursos/:id/reservas", function (req, res) {

    var id = req.params.id;

    var existe = false;
    for (var i = 0; i < recursos.length; i++) {
        if (recursos[i].id == id) {
            existe = true;
            break;
        }
    }

    if (!existe) {
        res.status(404).json("Recurso no encontrado");
        return;
    }

    var resultado = [];
    for (var i = 0; i < reservas.length; i++) {
        if (reservas[i].recurso == id) {
            resultado.push(reservas[i]);
        }
    }

    res.status(200).json(resultado);

});

// Obtener las reseñas de un recurso mediante su ID.
app.get("/api/recursos/:id/resenyas", function (req, res) {

    var id = req.params.id;

    var existe = false;
    for (var i = 0; i < recursos.length; i++) {
        if (recursos[i].id == id) {
            existe = true;
            break;
        }
    }

    if (!existe) {
        res.status(404).json("Recurso no encontrado");
        return;
    }

    var resultado = [];
    for (var i = 0; i < resenyas.length; i++) {
        if (resenyas[i].recurso == id) {
            resultado.push(resenyas[i]);
        }
    }

    res.status(200).json(resultado);

});

// Contar reservas que aún no han sido asignadas (EXAMEN).
app.get("/api/reservasSinAsignar", function (req, res) {

    var contador = 0;

    for (var i = 0; i < reservas.length; i++) {
        if (reservas[i].fecha_inicio == null) {
            contador++;
        }
    }

    res.status(200).json(contador);

});

// =================================================================
// LANZAMIENTO DEL SERVIDOR
// =================================================================

app.listen(PORT_REST)

console.log("-----------------------------------------");
console.log("Servidor REST ejecutándose en puerto: " + PORT_REST);
console.log("Acceso Gestor: http://localhost:3000/appCliente/index.html");
console.log("-----------------------------------------");