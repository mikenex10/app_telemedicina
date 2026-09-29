var express = require("express");
var app = express();

const PORT_REST = 3000;

app.use("/appCliente", express.static("cliente_rest")); 
app.use(express.json()); 

// =================================================================
// BASE DE DATOS
// =================================================================

var conexion = require("./conexion_mysql.js");

// =================================================================
// OPERACIONES
// =================================================================

// Consulta simple para ubicaciones.
app.get("/api/ubicaciones", function (req, res) {
    var sql = "SELECT * FROM ubicaciones";
    conexion.query(sql, function (err, ubicaciones) {
        if (err) {
            console.log("Error al realizar la select", err);
            res.status(500).json("Error al realizar la consulta");
        } else {
            res.status(200).json(ubicaciones);
        }
    });
});

// Consulta simple para categorias.
app.get("/api/categorias", function (req, res) {
    var sql = "SELECT * FROM categorias";
    conexion.query(sql, function (err, categorias) {
        if (err) {
            console.log("Error al realizar la select", err);
            res.status(500).json("Error al realizar la consulta");
        } else {
            res.status(200).json(categorias);
        }
    });
});

// Consulta simple para modelos.
app.get("/api/modelos", function (req, res) {
    var sql = "SELECT * FROM modelos";
    conexion.query(sql, function (err, modelos) {
        if (err) {
            console.log("Error al realizar la select", err);
            res.status(500).json("Error al realizar la consulta");
        } else {
            res.status(200).json(modelos);
        }
    });
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

    var sql = "SELECT id FROM gestores WHERE usuario = '" + usuario + "' AND password = '" + password + "'";
    conexion.query(sql, function (err, gestores) {
        if (err) {
            console.log("Error al realizar la select", err);
            res.status(500).json("Error al realizar la consulta");
        } else {
            if (gestores.length === 1) {
                res.status(200).json(gestores[0].id);
            } else {
                res.status(403).json("Credenciales incorrectas");
            }
        }
    });

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

    var sql = "SELECT id FROM gestores WHERE usuario = '" + usuario + "'";
    conexion.query(sql, function (err, gestores) {
        if (err) {
            console.log("Error al realizar la select", err);
            res.status(500).json("Error al realizar la consulta");
        } else if (gestores.length > 0) {
            res.status(403).json("El usuario ya existe");
        } else {
            var sqlInsert = "INSERT INTO gestores (nombre, apellidos, usuario, password) VALUES ('"
                + nombre + "','" + apellidos + "','" + usuario + "','" + password + "')";
            conexion.query(sqlInsert, function (err, resultado) {
                if (err) {
                    console.log("Error al realizar el insert", err);
                    res.status(500).json("Error al realizar la insercion");
                } else {
                    console.log("Gestor insertado:", resultado.insertId);
                    res.status(201).json(resultado.insertId);
                }
            });
        }
    });

});

// Actualizar gestor ya existente.
app.put("/api/gestores/:id", function (req, res) {

    var id = req.params.id;
    var sql = "SELECT * FROM gestores WHERE id = " + id;
    conexion.query(sql, function (err, gestores) {
        if (err) {
            console.log("Error al realizar la select", err);
            res.status(500).json("Error al realizar la consulta");
        } else if (gestores.length === 0) {
            res.status(404).json("Gestor no encontrado");
        } else {
            var gestor = gestores[0];

            // Si un campo no llega en la petición, se mantiene el valor actual.
            var nombre = req.body.nombre || gestor.nombre;
            var apellidos = req.body.apellidos || gestor.apellidos;
            var usuario = req.body.usuario || gestor.usuario;
            var password = req.body.password || gestor.password;

            var sqlUsuario = "SELECT id FROM gestores WHERE usuario = '" + usuario + "' AND id <> " + id;
            conexion.query(sqlUsuario, function (err, repetidos) {
                if (err) {
                    console.log("Error al realizar la select", err);
                    res.status(500).json("Error al realizar la consulta");
                } else if (repetidos.length > 0) {
                    res.status(403).json("El usuario ya existe");
                } else {
                    var sqlUpdate = "UPDATE gestores SET nombre = '" + nombre
                        + "', apellidos = '" + apellidos
                        + "', usuario = '" + usuario
                        + "', password = '" + password
                        + "' WHERE id = " + id;
                    conexion.query(sqlUpdate, function (err, resultado) {
                        if (err) {
                            console.log("Error al realizar el update", err);
                            res.status(500).json("Error al realizar la actualización");
                        } else {
                            res.status(200).json("Gestor actualizado correctamente");
                        }
                    });
                }
            });
        }
    });

});

// Obtener un gestor mediante su ID.
app.get("/api/gestores/:id", function (req, res) {

    var id = req.params.id;
    var sql = "SELECT id, nombre, apellidos, usuario FROM gestores WHERE id = " + id;
    conexion.query(sql, function (err, gestores) {
        if (err) {
            console.log("Error al realizar la select", err);
            res.status(500).json("Error al realizar la consulta");
        } else {
            if (gestores.length === 1) {
                res.status(200).json(gestores[0]);
            } else {
                res.status(404).json("Gestor no encontrado");
            }
        }
    });

});

// Contar sanitarios que tienen más de una reserva realizada (EXAMEN).
app.get("/api/sanitarios/variasReservas", function (req, res) {

    var sql = "SELECT COUNT(*) AS total FROM "
        + "(SELECT sanitario FROM reservas GROUP BY sanitario HAVING COUNT(*) > 1) AS s";
    conexion.query(sql, function (err, filas) {
        if (err) {
            console.log("Error al realizar la select", err);
            res.status(500).json("Error al realizar la consulta");
        } else {
            res.status(200).json(filas[0].total);
        }
    });

});

// Obtener un sanitario mediante su ID.
app.get("/api/sanitarios/:id", function (req, res) {

    var id = req.params.id;
    var sql = "SELECT id, nombre, apellidos, usuario FROM sanitarios WHERE id = " + id;
    conexion.query(sql, function (err, sanitarios) {
        if (err) {
            console.log("Error al realizar la select", err);
            res.status(500).json("Error al realizar la consulta");
        } else {
            if (sanitarios.length === 1) {
                res.status(200).json(sanitarios[0]);
            } else {
                res.status(404).json("Sanitario no encontrado");
            }
        }
    });

});

// Obtener recursos con filtro opcional.
app.get("/api/recursos", function (req, res) {

    var categoria = req.query.categoria;
    var modelo = req.query.modelo;
    var ubicacion = req.query.ubicacion;
    var estado = req.query.estado;

    var sql = "SELECT r.id, r.modelo, r.ubicacion, r.numero_serie, r.estado"
        + " FROM recursos r JOIN modelos m ON r.modelo = m.id"
        + " WHERE 1 = 1";

    if (modelo !== undefined && modelo !== "") {
        sql += " AND r.modelo = " + modelo;
    }
    if (ubicacion !== undefined && ubicacion !== "") {
        sql += " AND r.ubicacion = " + ubicacion;
    }
    if (estado !== undefined && estado !== "") {
        sql += " AND r.estado = " + estado;
    }
    if (categoria !== undefined && categoria !== "") {
        sql += " AND m.categoria = " + categoria;
    }

    conexion.query(sql, function (err, recursos) {
        if (err) {
            console.log("Error al realizar la select", err);
            res.status(500).json("Error al realizar la consulta");
        } else {
            res.status(200).json(recursos);
        }
    });

});

// Obtener recurso mediante su ID.
app.get("/api/recursos/:id", function (req, res) {

    var id = req.params.id;
    var sql = "SELECT * FROM recursos WHERE id = " + id;
    conexion.query(sql, function (err, recursos) {
        if (err) {
            console.log("Error al realizar la select", err);
            res.status(500).json("Error al realizar la consulta");
        } else {
            if (recursos.length === 1) {
                res.status(200).json(recursos[0]);
            } else {
                res.status(404).json("Recurso no encontrado");
            }
        }
    });

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

    var sql = "INSERT INTO recursos (modelo, ubicacion, numero_serie, estado) VALUES ("
        + modelo + "," + ubicacion + ",'" + numero_serie + "'," + estado + ")";
    conexion.query(sql, function (err, resultado) {
        if (err) {
            console.log("Error al realizar el insert", err);
            res.status(500).json("Error al realizar la insercion");
        } else {
            console.log("Recurso insertado:", resultado.insertId);
            res.status(201).json(resultado.insertId);
        }
    });

});

// Actualizar recurso mediante su ID.
app.put("/api/recursos/:id", function (req, res) {

    var id = req.params.id;

    var modelo = req.body.modelo;
    var ubicacion = req.body.ubicacion;
    var numero_serie = req.body.numero_serie;
    var estado = req.body.estado;

    if (modelo === undefined || ubicacion === undefined || !numero_serie || estado === undefined) {
        res.status(403).json("Faltan datos obligatorios");
        return;
    }

    var sql = "UPDATE recursos SET modelo = " + modelo
        + ", ubicacion = " + ubicacion
        + ", numero_serie = '" + numero_serie
        + "', estado = " + estado
        + " WHERE id = " + id;
    conexion.query(sql, function (err, resultado) {
        if (err) {
            console.log("Error al realizar el update", err);
            res.status(500).json("Error al realizar la actualización");
        } else if (resultado.affectedRows === 0) {
            res.status(404).json("Recurso no encontrado");
        } else {
            res.status(200).json("Recurso actualizado");
        }
    });

});

// Eliminar recurso mediante su ID.
app.delete("/api/recursos/:id", function (req, res) {

    var id = req.params.id;

    var sql = "DELETE FROM recursos WHERE id = " + id;
    conexion.query(sql, function (err, resultado) {
        if (err) {
            console.log("Error al realizar el delete", err);
            res.status(500).json("Error al realizar el borrado");
        } else if (resultado.affectedRows === 0) {
            res.status(404).json("Recurso no encontrado");
        } else {
            res.status(200).json("Recurso eliminado");
        }
    });

});

// Obtener las reservas de un recurso mediante su ID.
app.get("/api/recursos/:id/reservas", function (req, res) {

    var id = req.params.id;
    var sql = "SELECT * FROM reservas WHERE recurso = " + id;
    conexion.query(sql, function (err, reservas) {
        if (err) {
            console.log("Error al realizar la select", err);
            res.status(500).json("Error al realizar la consulta");
        } else {
            res.status(200).json(reservas);
        }
    });

});

// Obtener las reseñas de un recurso mediante su ID.
app.get("/api/recursos/:id/resenyas", function (req, res) {

    var id = req.params.id;
    var sql = "SELECT * FROM resenyas WHERE recurso = " + id;
    conexion.query(sql, function (err, resenyas) {
        if (err) {
            console.log("Error al realizar la select", err);
            res.status(500).json("Error al realizar la consulta");
        } else {
            res.status(200).json(resenyas);
        }
    });

});

// Contar reservas que aún no han sido asignadas (EXAMEN).
app.get("/api/reservasSinAsignar", function (req, res) {

    var sql = "SELECT COUNT(*) AS total FROM reservas WHERE fecha_inicio IS NULL";
    conexion.query(sql, function (err, filas) {
        if (err) {
            console.log("Error al realizar la select", err);
            res.status(500).json("Error al realizar la consulta");
        } else {
            res.status(200).json(filas[0].total);
        }
    });

});

// =================================================================
// LANZAMIENTO DEL SERVIDOR
// =================================================================

app.listen(PORT_REST)

console.log("-----------------------------------------");
console.log("Servidor REST ejecutándose en puerto: " + PORT_REST);
console.log("Acceso Gestor: http://localhost:3000/appCliente/index.html");
console.log("-----------------------------------------");