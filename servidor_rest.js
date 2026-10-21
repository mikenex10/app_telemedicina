var express = require("express");
var jwt = require('jwt-simple');
var clave = 'telemedicina2026'; // clave para codificar / decodificar el token

var app = express();

const PORT_REST = 3000;

app.use("/appCliente", express.static("cliente_rest"));
app.use(express.json());

// =================================================================
// BASE DE DATOS
// =================================================================

// 1. Importar el cliente de Supabase
const { createClient } = require('@supabase/supabase-js');

// 2. Configurar con tu URL y tu Public Key (anon key)
const supabaseUrl = 'https://yxwnoifdjhbakilrdzsz.supabase.co';
const supabaseKey = 'sb_publishable_M8JATiEUNbW-Y9Ce3bLJeg_Pj7FU2WQ';
const supabase = createClient(supabaseUrl, supabaseKey);

// =================================================================
// OPERACIONES
// =================================================================

// Autentificación de gestores.
app.post("/api/gestores/login", async function (req, res) {
    console.log(req.body);

    var usuario = req.body.usuario;
    var password = req.body.password;

    if (!usuario || !password) {
        res.status(403).json("Faltan credenciales");
        return;
    };

    try {
        const { data: gestores, error } = await supabase
            .from('gestores')
            .select('id')
            .eq('usuario', usuario)
            .eq('password', password);

        if (error) {
            console.log("Error al realizar la select", error);
            return res.status(500).json("Error al realizar la consulta");
        }

        if (gestores.length === 1) {
            // Crear un token
            var contenido = { // contenido del token (se puede incluir la información que necesitemos)
                usuario: gestores[0].id,
                expira: Date.now() + 60 * 60 * 1000 // expira dentro de 1 hora (en ms)
            };
            var token = jwt.encode(contenido, clave);
            res.status(200).json({ id: gestores[0].id, token: token });
        } else {
            res.status(403).json("Credenciales incorrectas");
        }
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }

});

// Registro de nuevo gestor.
app.post("/api/gestores", async function (req, res) {
    console.log(req.body);

    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;
    var usuario = req.body.usuario;
    var password = req.body.password;

    if (!nombre || !apellidos || !usuario || !password) {
        res.status(403).json("Faltan datos obligatorios");
        return;
    };

    try {
        const { data: gestores, error } = await supabase
            .from('gestores')
            .select('id')
            .eq('usuario', usuario);

        if (error) {
            console.log("Error al realizar la select", error);
            return res.status(500).json("Error al realizar la consulta");
        }

        if (gestores.length > 0) {
            return res.status(403).json("El usuario ya existe");
        }

        const { data: insertado, error: errorInsert } = await supabase
            .from('gestores')
            .insert({ nombre: nombre, apellidos: apellidos, usuario: usuario, password: password })
            .select('id');

        if (errorInsert) {
            console.log("Error al realizar el insert", errorInsert);
            return res.status(500).json("Error al realizar la insercion");
        }

        console.log("Gestor insertado:", insertado[0].id);
        res.status(201).json(insertado[0].id);
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }

});

// Antes de este use, los servicios son públicos (no necesitan token)
// Con esta función intermedia validamos el token. Si no es correcto terminamos con un error. Si es correcto continuamos.
app.use("/api", function (req, res, next) {
    var token = req.query.token; // obtengo el token de una query de la URL: http://MI_SERVIDOR/MI_RUTA?token=XXXXXXXX
    if (!token) { // no se ha pasado un token
        res.status(301).json("No se ha encontrado token");
        return;
    }

    // Decodificar el token
    try { // capturamos el error por si el token no es correcto
        var contenidoToken = jwt.decode(token, clave); // decodificamos el token para obtener su contenido con la misma clave que se codificó
    } catch (error) {
        res.status(301).json("El token es incorrecto");
        return;
    }
    console.log("El contenido del token es:", contenidoToken);

    // Validar el token
    if (!contenidoToken || !contenidoToken.expira || !contenidoToken.usuario) { // validamos el formato del token
        res.status(301).json("El formato del token no es adecuado")
        return;
    }

    // Comprobar la fecha de expiración
    if (contenidoToken.expira < Date.now()) {
        res.status(301).json("El token ha expirado");
        return
    }
    // Todo ha ido bien. con next hago que express continue con el procesado
    next();
});
// Después de este use, los servicios son privados (necesitan el token)

// Consulta simple para ubicaciones.
app.get("/api/ubicaciones", async function (req, res) {
    try {
        const { data: ubicaciones, error } = await supabase
            .from('ubicaciones')
            .select('*');

        if (error) {
            console.log("Error al realizar la select", error);
            return res.status(500).json("Error al realizar la consulta");
        }

        res.status(200).json(ubicaciones);
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }
});

// Consulta simple para categorias.
app.get("/api/categorias", async function (req, res) {
    try {
        const { data: categorias, error } = await supabase
            .from('categorias')
            .select('*');

        if (error) {
            console.log("Error al realizar la select", error);
            return res.status(500).json("Error al realizar la consulta");
        }

        res.status(200).json(categorias);
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }
});

// Consulta simple para modelos.
app.get("/api/modelos", async function (req, res) {
    try {
        const { data: modelos, error } = await supabase
            .from('modelos')
            .select('*');

        if (error) {
            console.log("Error al realizar la select", error);
            return res.status(500).json("Error al realizar la consulta");
        }

        res.status(200).json(modelos);
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }
});

// Actualizar gestor ya existente.
app.put("/api/gestores/:id", async function (req, res) {

    var id = req.params.id;

    try {
        const { data: gestores, error } = await supabase
            .from('gestores')
            .select('*')
            .eq('id', id);

        if (error) {
            console.log("Error al realizar la select", error);
            return res.status(500).json("Error al realizar la consulta");
        }

        if (gestores.length === 0) {
            return res.status(404).json("Gestor no encontrado");
        }

        var gestor = gestores[0];

        // Si un campo no llega en la petición, se mantiene el valor actual.
        var nombre = req.body.nombre || gestor.nombre;
        var apellidos = req.body.apellidos || gestor.apellidos;
        var usuario = req.body.usuario || gestor.usuario;
        var password = req.body.password || gestor.password;

        const { data: repetidos, error: errorUsuario } = await supabase
            .from('gestores')
            .select('id')
            .eq('usuario', usuario)
            .neq('id', id);

        if (errorUsuario) {
            console.log("Error al realizar la select", errorUsuario);
            return res.status(500).json("Error al realizar la consulta");
        }

        if (repetidos.length > 0) {
            return res.status(403).json("El usuario ya existe");
        }

        const { error: errorUpdate } = await supabase
            .from('gestores')
            .update({ nombre: nombre, apellidos: apellidos, usuario: usuario, password: password })
            .eq('id', id);

        if (errorUpdate) {
            console.log("Error al realizar el update", errorUpdate);
            return res.status(500).json("Error al realizar la actualización");
        }

        res.status(200).json("Gestor actualizado correctamente");
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }

});

// Obtener un gestor mediante su ID.
app.get("/api/gestores/:id", async function (req, res) {

    var id = req.params.id;

    try {
        const { data: gestores, error } = await supabase
            .from('gestores')
            .select('id, nombre, apellidos, usuario')
            .eq('id', id);

        if (error) {
            console.log("Error al realizar la select", error);
            return res.status(500).json("Error al realizar la consulta");
        }

        if (gestores.length === 1) {
            res.status(200).json(gestores[0]);
        } else {
            res.status(404).json("Gestor no encontrado");
        }
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }

});

// Contar sanitarios que tienen más de una reserva realizada (EXAMEN).
app.get("/api/sanitarios/variasReservas", async function (req, res) {

    try {
        const { data: reservas, error } = await supabase
            .from('reservas')
            .select('sanitario');

        if (error) {
            console.log("Error al realizar la select", error);
            return res.status(500).json("Error al realizar la consulta");
        }

        var reservasPorSanitario = {};
        reservas.forEach(function (r) {
            if (!reservasPorSanitario[r.sanitario]) reservasPorSanitario[r.sanitario] = 0;
            reservasPorSanitario[r.sanitario]++;
        });

        var total = 0;
        Object.keys(reservasPorSanitario).forEach(function (sanitario) {
            if (reservasPorSanitario[sanitario] > 1) total++;
        });

        res.status(200).json(total);
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }

});

// Obtener un sanitario mediante su ID.
app.get("/api/sanitarios/:id", async function (req, res) {

    var id = req.params.id;

    try {
        const { data: sanitarios, error } = await supabase
            .from('sanitarios')
            .select('id, nombre, apellidos, usuario')
            .eq('id', id);

        if (error) {
            console.log("Error al realizar la select", error);
            return res.status(500).json("Error al realizar la consulta");
        }

        if (sanitarios.length === 1) {
            res.status(200).json(sanitarios[0]);
        } else {
            res.status(404).json("Sanitario no encontrado");
        }
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }

});

// Obtener recursos con filtro opcional.
app.get("/api/recursos", async function (req, res) {

    var categoria = req.query.categoria;
    var modelo = req.query.modelo;
    var ubicacion = req.query.ubicacion;
    var estado = req.query.estado;

    try {
        var consulta = supabase
            .from('recursos')
            .select('id, modelo, ubicacion, numero_serie, estado');

        if (modelo !== undefined && modelo !== "") {
            consulta = consulta.eq('modelo', modelo);
        }
        if (ubicacion !== undefined && ubicacion !== "") {
            consulta = consulta.eq('ubicacion', ubicacion);
        }
        if (estado !== undefined && estado !== "") {
            consulta = consulta.eq('estado', estado);
        }
        if (categoria !== undefined && categoria !== "") {
            const { data: modelos, error: errorModelos } = await supabase
                .from('modelos')
                .select('id')
                .eq('categoria', categoria);

            if (errorModelos) {
                console.log("Error al realizar la select", errorModelos);
                return res.status(500).json("Error al realizar la consulta");
            }

            consulta = consulta.in('modelo', modelos.map(m => m.id));
        }

        const { data: recursos, error } = await consulta;

        if (error) {
            console.log("Error al realizar la select", error);
            return res.status(500).json("Error al realizar la consulta");
        }

        res.status(200).json(recursos);
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }

});

// Obtener recurso mediante su ID.
app.get("/api/recursos/:id", async function (req, res) {

    var id = req.params.id;

    try {
        const { data: recursos, error } = await supabase
            .from('recursos')
            .select('*')
            .eq('id', id);

        if (error) {
            console.log("Error al realizar la select", error);
            return res.status(500).json("Error al realizar la consulta");
        }

        if (recursos.length === 1) {
            res.status(200).json(recursos[0]);
        } else {
            res.status(404).json("Recurso no encontrado");
        }
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }

});

// Registro de nuevo recurso.
app.post("/api/recursos", async function (req, res) {

    var modelo = req.body.modelo;
    var ubicacion = req.body.ubicacion;
    var numero_serie = req.body.numero_serie;
    var estado = req.body.estado;

    if (modelo === undefined || ubicacion === undefined || !numero_serie || estado === undefined) {
        res.status(403).json("Faltan datos obligatorios");
        return;
    }

    try {
        const { data: insertado, error } = await supabase
            .from('recursos')
            .insert({ modelo: modelo, ubicacion: ubicacion, numero_serie: numero_serie, estado: estado })
            .select('id');

        if (error) {
            console.log("Error al realizar el insert", error);
            return res.status(500).json("Error al realizar la insercion");
        }

        console.log("Recurso insertado:", insertado[0].id);
        res.status(201).json(insertado[0].id);
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }

});

// Actualizar recurso mediante su ID.
app.put("/api/recursos/:id", async function (req, res) {

    var id = req.params.id;

    var modelo = req.body.modelo;
    var ubicacion = req.body.ubicacion;
    var numero_serie = req.body.numero_serie;
    var estado = req.body.estado;

    if (modelo === undefined || ubicacion === undefined || !numero_serie || estado === undefined) {
        res.status(403).json("Faltan datos obligatorios");
        return;
    }

    try {
        const { data: actualizados, error } = await supabase
            .from('recursos')
            .update({ modelo: modelo, ubicacion: ubicacion, numero_serie: numero_serie, estado: estado })
            .eq('id', id)
            .select('id');

        if (error) {
            console.log("Error al realizar el update", error);
            return res.status(500).json("Error al realizar la actualización");
        }

        if (actualizados.length === 0) {
            res.status(404).json("Recurso no encontrado");
        } else {
            res.status(200).json("Recurso actualizado");
        }
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }

});

// Eliminar recurso mediante su ID.
app.delete("/api/recursos/:id", async function (req, res) {

    var id = req.params.id;

    try {
        const { data: eliminados, error } = await supabase
            .from('recursos')
            .delete()
            .eq('id', id)
            .select('id');

        if (error) {
            console.log("Error al realizar el delete", error);
            return res.status(500).json("Error al realizar el borrado");
        }

        if (eliminados.length === 0) {
            res.status(404).json("Recurso no encontrado");
        } else {
            res.status(200).json("Recurso eliminado");
        }
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }

});

// Obtener las reservas de un recurso mediante su ID.
app.get("/api/recursos/:id/reservas", async function (req, res) {

    var id = req.params.id;

    try {
        const { data: reservas, error } = await supabase
            .from('reservas')
            .select('*')
            .eq('recurso', id);

        if (error) {
            console.log("Error al realizar la select", error);
            return res.status(500).json("Error al realizar la consulta");
        }

        res.status(200).json(reservas);
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }

});

// Obtener las reseñas de un recurso mediante su ID.
app.get("/api/recursos/:id/resenyas", async function (req, res) {

    var id = req.params.id;

    try {
        const { data: resenyas, error } = await supabase
            .from('resenyas')
            .select('*')
            .eq('recurso', id);

        if (error) {
            console.log("Error al realizar la select", error);
            return res.status(500).json("Error al realizar la consulta");
        }

        res.status(200).json(resenyas);
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }

});

// Contar reservas que aún no han sido asignadas (EXAMEN).
app.get("/api/reservasSinAsignar", async function (req, res) {

    try {
        const { data: reservas, error } = await supabase
            .from('reservas')
            .select('id')
            .is('fecha_inicio', null);

        if (error) {
            console.log("Error al realizar la select", error);
            return res.status(500).json("Error al realizar la consulta");
        }

        res.status(200).json(reservas.length);
    } catch (err) {
        console.error("Error en el servidor:", err);
        res.status(500).json("Error interno del servidor");
    }

});

// =================================================================
// LANZAMIENTO DEL SERVIDOR
// =================================================================

app.listen(PORT_REST)

console.log("-----------------------------------------");
console.log("Servidor REST ejecutándose en puerto: " + PORT_REST);
console.log("Acceso Gestor: http://localhost:3000/appCliente/index.html");
console.log("-----------------------------------------");
