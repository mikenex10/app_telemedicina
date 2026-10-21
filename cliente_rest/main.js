var categorias = [];
var modelos = [];
var ubicaciones = [];

var gestorActual = null;
var token = null;
var app = document.getElementById("app");
var textoUsuario = document.getElementById("textoUsuario");

var URL_MINISTERIO = "https://undefined.ua.es/telemedicina/api/datos";
var ID_AREA = 11;

var AREAS_MEDICAS = {
    1: "Alergología",
    2: "Anestesiología",
    3: "Cardiología",
    4: "Cirugía General",
    5: "Dermatología",
    6: "Aparato Digestivo",
    7: "Endocrinología",
    8: "Ginecología",
    9: "Hematología",
    10: "Medicina Interna",
    11: "Neumología",
    12: "Neurología",
    13: "Oftalmología",
    14: "Oncología",
    15: "Pediatría",
    16: "Psiquiatría",
    17: "Traumatología",
    18: "Urología"
};

// =================================================================
// WEBSOCKET
// =================================================================

var ws = null;
var avisosGestor = [];

function abrirWS(idGestor) {
    ws = new WebSocket("ws://localhost:3502");

    // Cuando el gestor se conecte, registrarlo en el array de gestores del WS del servidor.
    ws.onopen = function () {
        console.log("WS: Conexión abierta (gestor)");
        // Registrarse en el servidor WS como gestor
        ws.send(JSON.stringify({tipo: "registro", rol: "gestor", id: idGestor}));
    };

    // Cuando llegue un aviso, añadirlo a la tabla y actualizarla.
    ws.onmessage = function (evento) {
        var msg = JSON.parse(evento.data);
        if (msg.tipo === "aviso") {
            avisosGestor.push(msg);
            actualizarTablaAvisos();
        }
    };

    ws.onclose = function () {
        console.log("WS: Conexión cerrada (gestor)");
    };

}

// Función para cerrar el WS cuando el gestor haga logout.
function cerrarWS() {
    if (ws) {
        ws.close();
        ws = null;
    }
    avisosGestor = [];
}

// Actualiza la tabla de avisos del sanitario.
function actualizarTablaAvisos() {
    var contenedor = document.getElementById("tablaAvisos");
    if (!contenedor) return;

    if (avisosGestor.length === 0) {
        contenedor.innerHTML = "<p style='color:var(--muted); font-size:14px;'>No hay avisos recibidos.</p>";
        return;
    }

    var filas = avisosGestor.map(function (aviso) {
        var colorFondo;
        if (aviso.color === "verde") {
            colorFondo = "var(--aviso-verde)";
        } else if (aviso.color === "azul") {
            colorFondo = "var(--aviso-azul)";
        } else {
            colorFondo = "var(--aviso-rojo)";
        }
        return "<tr style='background:" + colorFondo + ";'>" +
            "<td>" + formatearFecha(aviso.fecha) + "</td>" +
            "<td>" + aviso.origen + "</td>" +
            "<td>" + aviso.texto + "</td>" +
            "</tr>";
    }).join("");

    contenedor.innerHTML =
        "<table>" +
        "<thead><tr><th>Fecha</th><th>Origen</th><th>Aviso</th></tr></thead>" +
        "<tbody>" + filas + "</tbody>" +
        "</table>";
}

// =================================================================
// FUNCIONES
// =================================================================

// Muestra el formulario de login de gestor.
function mostrarLogin() {
    textoUsuario.innerHTML = "";
    app.innerHTML = `
        <h1 class="login-title">Portal del gestor</h1>
        <div class="card">
            <h2>Inicio de sesión</h2>
            <div class="row">
                <div class="field">
                    <label>Usuario</label>
                    <input id="usuario_registro">
                </div>
                <div class="field">
                    <label>Contraseña</label>
                    <input type="password" id="password_login">
                </div>
            </div>
            <button class="primary" onclick="login()">Entrar</button>
            <button onclick="mostrarRegistro()">Registrarse</button>
        </div>
    `;
}

// Muestra el formulario de registro de gestor.
function mostrarRegistro() {
    app.innerHTML = `
        <h1 class="login-title">Portal del gestor</h1>
        <div class="card">
            <h2>Registro</h2>
            <div class="row">
                <div class="field">
                    <label>Nombre</label>
                    <input id="nombre_registro">
                </div>
                <div class="field">
                    <label>Apellidos</label>
                    <input id="apellidos_registro">
                </div>
            </div>
            <div class="row">
                <div class="field">
                    <label>Usuario</label>
                    <input id="usuario_registro">
                </div>
                <div class="field">
                    <label>Contraseña</label>
                    <input type="password" id="password_registro">
                </div>
            </div>
            <button class="success" onclick="registrarGestor()">Registrar</button>
            <button onclick="mostrarLogin()">Volver</button>
        </div>
    `;
}

// Envío de datos de registro de un nuevo gestor (POST)
function registrarGestor() {
    var nombre = document.getElementById("nombre_registro").value;
    var apellidos = document.getElementById("apellidos_registro").value;
    var usuario = document.getElementById("usuario_registro").value;
    var password = document.getElementById("password_registro").value;

    if (!nombre || !apellidos || !usuario || !password) {
        alert("¡Todos los campos son obligatorios!");
        return;
    }

    var datos = {
        nombre: nombre,
        apellidos: apellidos,
        usuario: usuario,
        password: password
    };

    rest.post("/api/gestores", datos, function(estado, respuesta) {
        if (estado === 201) {
            alert("Registro correcto. Ahora puedes iniciar sesión.");
            mostrarLogin();
        } else {
            alert("Error: " + respuesta);
        }
    });
}

// Inicio de sesión (POST)
function login() {
    var usuario = document.getElementById("usuario_registro").value;
    var password = document.getElementById("password_login").value;

    rest.post("/api/gestores/login", { usuario, password }, function(estado, respuesta) {
        if (estado === 200) {
            token = respuesta.token;
            cargarGestor(respuesta.id);
        } else {
            alert("Usuario o contraseña incorrectos.");
        }
    });
}

// Carga los datos del gestor que ha iniciado sesión (GET)
function cargarGestor(id) {
    rest.get("/api/gestores/" + id + "?token=" + token, function(estado, respuesta) {
        if (estado === 200) {
            gestorActual = respuesta;
            abrirWS(gestorActual.id); // Abrir WebSocket tras login exitoso
            mostrarHome();
        }
    });
}

// Construye la pantalla principal del gestor
function mostrarHome() {
    textoUsuario.innerHTML = `
        ${gestorActual.nombre} ${gestorActual.apellidos}
        <button onclick="editarPerfil()">Editar perfil</button>
        <button onclick="logout()">Salir</button>
    `;

    rest.get("/api/categorias?token=" + token, (s,r) => { categorias = r; cargarDatos(); });
    rest.get("/api/modelos?token=" + token, (s,r) => { modelos = r; cargarDatos(); });
    rest.get("/api/ubicaciones?token=" + token,(s,r) => { ubicaciones = r; cargarDatos(); });

    app.innerHTML = `
        <h1 class="login-title">Portal del gestor</h1>
        <div class="card">
            <h2>Búsqueda de recursos</h2>
            <div class="row">
                <div class="field">
                    <label>Categoría</label>
                    <select id="fCategoria"></select>
                </div>
                <div class="field">
                    <label>Modelo</label>
                    <select id="fModelo"></select>
                </div>
                <div class="field">
                    <label>Ubicación</label>
                    <select id="fUbicacion"></select>
                </div>
                <div class="field">
                    <label>Estado</label>
                    <select id="fEstado">
                        <option value="">Todos</option>
                        <option value="0">Operativo</option>
                        <option value="1">Baja</option>
                        <option value="2">Mantenimiento</option>
                    </select>
                </div>
            </div>
            <button class="primary" onclick="buscar()">Buscar</button>
            <button onclick="nuevoRecurso()">Añadir Recurso</button>

            <div id="tablaRecursos"></div>
        </div>

        <div class="card">
            <h2>Avisos recibidos</h2>
            <div id="tablaAvisos"></div>
        </div>

        <div class="card">
            <h2>Ranking de reservas por área médica</h2>
            <button class="primary" onclick="enviarMinisterio()">Enviar reservas al Ministerio</button>
            <div id="tablaRanking"></div>
        </div>
    `;

    actualizarTablaAvisos();
    cargarRanking();
}

// Obtiene las reservas de todos los recursos para enviarlas al Ministerio (GET)
function enviarMinisterio() {
    rest.get("/api/recursos?token=" + token, function(estado, recursos) {
        if (estado !== 200) return;

        var reservas = [];
        var pendientes = recursos.length;

        recursos.forEach(function(recurso) {
            rest.get("/api/recursos/" + recurso.id + "/reservas?token=" + token, function(estado, respuesta) {
                if (estado === 200) {
                    respuesta.forEach(r => reservas.push(r));
                }
                pendientes--;
                if (pendientes === 0) completarReservas(recursos, reservas);
            });
        });
    });
}

// Añade a cada reserva los datos del sanitario y la categoría del recurso (GET)
function completarReservas(recursos, reservas) {
    var datos = [];
    var pendientes = reservas.length;

    reservas.forEach(function(r) {
        rest.get("/api/sanitarios/" + r.sanitario + "?token=" + token, function(estado, sanitario) {
            if (estado === 200) {
                var recurso = recursos.find(x => x.id == r.recurso);
                var modelo = modelos.find(m => m.id == recurso.modelo);
                var categoria = categorias.find(c => c.id == modelo.categoria);

                datos.push({
                    nombre: sanitario.nombre,
                    apellidos: sanitario.apellidos,
                    "categoría": categoria.nombre,
                    horas_estimadas: r.horas_estimadas,
                    fec_pet: r.fecha_peticion,
                    fec_ini: r.fecha_inicio,
                    fecha_fin: r.fecha_fin
                });
            }
            pendientes--;
            if (pendientes === 0) subirReservas(datos);
        });
    });
}

// Envía todas las reservas al Ministerio de Sanidad (POST)
function subirReservas(datos) {
    var envio = {
        id_area: ID_AREA,
        fecha: new Date().toISOString().substring(0, 10),
        datos: datos
    };

    rest.post(URL_MINISTERIO, envio, function(estado, respuesta) {
        if (estado >= 200 && estado < 300) {
            alert("Reservas enviadas al Ministerio.");
            cargarRanking();
        } else {
            alert("Error al enviar las reservas al Ministerio.");
        }
    });
}

// Obtiene los datos del Ministerio y muestra el ranking de reservas por área médica (GET)
function cargarRanking() {
    rest.get(URL_MINISTERIO, function(estado, respuesta) {
        if (estado !== 200) return;

        var totales = {};
        respuesta.forEach(function(envio) {
            if (!AREAS_MEDICAS[envio.id_area]) return;
            if (!totales[envio.id_area]) totales[envio.id_area] = 0;
            totales[envio.id_area] += envio.datos.length;
        });

        var ranking = Object.keys(totales).map(function(id) {
            return { area: AREAS_MEDICAS[id], total: totales[id] };
        });
        ranking.sort(function(a, b) {
            return b.total - a.total;
        });

        document.getElementById("tablaRanking").innerHTML = `
            <table>
                <tr>
                    <th>#</th>
                    <th>Área Médica</th>
                    <th>Reservas Totales</th>
                </tr>
                ${ranking.map((r, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${r.area}</td>
                        <td>${r.total}</td>
                    </tr>
                `).join("")}
            </table>
        `;
    });
}

// Construye la pantalla de editar datos del gestor
function editarPerfil() {
    app.innerHTML = `
        <h1 class="login-title">Portal del gestor</h1>
        <div class="card">
            <h2>Editar perfil</h2>
            <div class="row">
                <div class="field">
                    <label>Nombre</label>
                    <input id="ep_nombre" value="${gestorActual.nombre}">
                </div>
                <div class="field">
                    <label>Apellidos</label>
                    <input id="ep_apellidos" value="${gestorActual.apellidos}">
                </div>
            </div>
            <div class="row">
                <div class="field">
                    <label>Usuario</label>
                    <input id="ep_usuario" value="${gestorActual.usuario}">
                </div>
                <div class="field">
                    <label>Nueva contraseña</label>
                    <input type="password" id="ep_password">
                </div>
            </div>
            <button class="success" onclick="guardarPerfil()">Guardar</button>
            <button onclick="mostrarHome()">Cancelar</button>
        </div>
    `;
}

// Guarda los datos editados del gestor.
function guardarPerfil() {
    var datos = {
        nombre: document.getElementById("ep_nombre").value,
        apellidos: document.getElementById("ep_apellidos").value,
        usuario: document.getElementById("ep_usuario").value,
        password: document.getElementById("ep_password").value
    };

    rest.put("/api/gestores/" + gestorActual.id + "?token=" + token, datos, function(estado, respuesta) {
        if (estado === 200) {
            gestorActual.nombre = datos.nombre;
            gestorActual.apellidos = datos.apellidos;
            gestorActual.usuario = datos.usuario;
            alert("Perfil actualizado correctamente.");
            mostrarHome();
        } else {
            alert("Error: " + respuesta);
        }
    });
}

// Rellena los desplegables para cada recurso.
function cargarDatos() {
    if (!categorias.length || !modelos.length || !ubicaciones.length) return;

    var selCat = document.getElementById("fCategoria");
    var selMod = document.getElementById("fModelo");
    var selUbi = document.getElementById("fUbicacion");

    if (!selCat) return;

    selCat.innerHTML = '<option value="">Todos</option>' +
        categorias.map(c => `<option value="${c.id}">${c.nombre}</option>`).join("");

    selMod.innerHTML = '<option value="">Todos</option>' +
        modelos.map(m => `<option value="${m.id}">${m.nombre}</option>`).join("");

    selUbi.innerHTML = '<option value="">Todos</option>' +
        ubicaciones.map(u => `<option value="${u.id}">${u.nombre}</option>`).join("");
}

// Busca un recurso aplicando un filtro.
function buscar() {
    var c = fCategoria.value;
    var m = fModelo.value;
    var u = fUbicacion.value;
    var e = fEstado.value;

    var url = `/api/recursos?categoria=${c}&modelo=${m}&ubicacion=${u}&estado=${e}&token=${token}`;

    rest.get(url, function(estado, respuesta) {
        if (estado === 200) mostrarTabla(respuesta);
    });
}

// Muestra los resultados de una búsqueda en tabla.
function mostrarTabla(recursos) {
    var tabla = document.getElementById("tablaRecursos");

    tabla.innerHTML = `
        <table>
            <tr>
                <th>Nº Serie</th>
                <th>Categoría</th>
                <th>Modelo</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
            ${recursos.map(r => filaRecurso(r)).join("")}
        </table>
    `;
}

// Genera una de las filas de la tabla de recursos a mostrar.
function filaRecurso(r) {
    var modelo = modelos.find(m => m.id == r.modelo);
    var categoria = categorias.find(c => c.id == modelo.categoria);
    var ubicacion = ubicaciones.find(u => u.id == r.ubicacion);

    var estadoTexto = ["Operativo","Baja","Mantenimiento"][r.estado];

    return `
        <tr>
            <td>${r.numero_serie}</td>
            <td>${categoria.nombre}</td>
            <td>${modelo.nombre}</td>
            <td>${ubicacion.nombre}</td>
            <td>${estadoTexto}</td>
            <td>
                <button onclick="abrirRecurso(${r.id})">Abrir</button>
                <button class="danger" onclick="borrarRecurso(${r.id})">X</button>
            </td>
        </tr>
    `;
}

// Envía una petición DELETE para borrar un recurso.
function borrarRecurso(id) {
    var seguro = confirm("¿Estás seguro de que quieres borrar este recurso?");
    if (seguro) {
        rest.delete("/api/recursos/" + id + "?token=" + token, function(estado) {
            if (estado === 200) buscar();
        });
    }
}

// Prepara la ficha de un nuevo recurso.
function nuevoRecurso() {
    mostrarFicha({ id: null, modelo: "", ubicacion: "", numero_serie: "", estado: 0 });
}

// Abre la ficha de un recurso concreto para ser editado.
function abrirRecurso(id) {
    rest.get("/api/recursos/" + id + "?token=" + token, function(estado, respuesta) {
        if (estado === 200) mostrarFicha(respuesta);
    });
}

// Muestra la ficha de un recurso.
function mostrarFicha(r) {
    app.innerHTML = `
        <h1 class="login-title">Portal del gestor</h1>
        <div class="card">
            <h2>Recurso</h2>
            <div class="row">
                <div class="field">
                    <label>Modelo</label>
                    <select id="rModelo">
                        ${modelos.map(m => `<option value="${m.id}" ${m.id == r.modelo ? "selected" : ""}>${m.nombre}</option>`).join("")}
                    </select>
                </div>
                <div class="field">
                    <label>Ubicación</label>
                    <select id="rUbicacion">
                        ${ubicaciones.map(u => `<option value="${u.id}" ${u.id == r.ubicacion ? "selected" : ""}>${u.nombre}</option>`).join("")}
                    </select>
                </div>
                <div class="field">
                    <label>Nº Serie</label>
                    <input id="rSerie" value="${r.numero_serie || ""}">
                </div>
                <div class="field">
                    <label>Estado</label>
                    <select id="rEstado">
                        <option value="0" ${r.estado == 0 ? "selected" : ""}>Operativo</option>
                        <option value="1" ${r.estado == 1 ? "selected" : ""}>Baja</option>
                        <option value="2" ${r.estado == 2 ? "selected" : ""}>Mantenimiento</option>
                    </select>
                </div>
            </div>

            <button class="success" onclick="guardarRecurso(${r.id})">Guardar</button>
            <button onclick="mostrarHome()">Volver</button>

            <div id="reservas"></div>
            <div id="resenyas"></div>
        </div>
    `;

    if (r.id) {
        cargarReservas(r.id);
        cargarResenyas(r.id);
    }
}

// Envía los datos del recurso para crearlo (POST) o modificarlo (PUT).
// Si es nuevo, además avisa por WS a todos los sanitarios.
function guardarRecurso(id) {

    if (!rSerie.value) {
        alert("El número de serie es obligatorio.");
        return;
    }

    var data = {
        modelo:       rModelo.value,
        ubicacion:    rUbicacion.value,
        numero_serie: rSerie.value,
        estado:       rEstado.value
    };

    if (id) {
        // Actualizar recurso existente
        rest.put("/api/recursos/" + id + "?token=" + token, data, () => mostrarHome());
    } else {
        // Crear recurso nuevo → notificar por WS
        rest.post("/api/recursos?token=" + token, data, function(estado, respuesta) {
            if (estado === 201 && ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    tipo: "nuevoRecurso",
                    idRecurso: respuesta,
                    idGestor: gestorActual.id
                }));
            }
            mostrarHome();
        });
    }
}

// Obtiene y muestra el historial de reservas de un recurso (GET)
function cargarReservas(id) {
    rest.get("/api/recursos/" + id + "/reservas?token=" + token, function(estado, respuesta) {
        if (estado !== 200) return;

        var html = `
            <h3>Reservas</h3>
            <table>
                <tr>
                    <th>Sanitario</th>
                    <th>Horas</th>
                    <th>Petición</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                </tr>
                ${respuesta.map(r => filaReserva(r)).join("")}
            </table>
        `;
        document.getElementById("reservas").innerHTML = html;
    });
}

// Genera una de las filas de la tabla de reservas a mostrar.
function filaReserva(r) {
    var ahora = new Date();
    var inicio = r.fecha_inicio ? new Date(r.fecha_inicio) : null;
    var fin = r.fecha_fin ? new Date(r.fecha_fin) : null;

    var clase = "finalizada";

    if (!inicio) {
        clase = "pendiente";
    } else if (inicio && !fin) {
        var horasTranscurridas = (ahora - inicio) / 1000 / 60 / 60;
        if (horasTranscurridas > r.horas_estimadas) clase = "superada";
        else clase = "enUso";
    }

    return `
        <tr class="${clase}">
            <td>${r.sanitario}</td>
            <td>${r.horas_estimadas}</td>
            <td>${formatearFecha(r.fecha_peticion) || ""}</td>
            <td>${formatearFecha(r.fecha_inicio) || ""}</td>
            <td>${formatearFecha(r.fecha_fin) || ""}</td>
        </tr>
    `;
}

// Carga y muestra las reseñas de un recurso.
function cargarResenyas(id) {
    rest.get("/api/recursos/" + id + "/resenyas?token=" + token, function(estado, respuesta) {
        if (estado !== 200) return;

        var html = `
            <h3>Reseñas</h3>
            <table>
                <tr>
                    <th>Fecha</th>
                    <th>Sanitario</th>
                    <th>Valor</th>
                    <th>Comentario</th>
                </tr>
                ${respuesta.map(r => `
                    <tr>
                        <td>${formatearFecha(r.fecha)}</td>
                        <td>${r.sanitario}</td>
                        <td>${r.valor}</td>
                        <td>${r.descripcion}</td>
                    </tr>
                `).join("")}
            </table>
        `;
        document.getElementById("resenyas").innerHTML = html;
    });
}

// Cierra sesión y vuelve a la pantalla de login.
function logout() {
    cerrarWS();
    gestorActual = null;
    token = null;
    mostrarLogin();
}

// Formatea las fechas para que sean más legibles.
function formatearFecha(fechaISO) {
    if (!fechaISO) return "-";

    var d = new Date(fechaISO);

    var dia = d.getDate().toString().padStart(2, '0');
    var mes = (d.getMonth() + 1).toString().padStart(2, '0');
    var anio = d.getFullYear();
    var hora = d.getHours().toString().padStart(2, '0');
    var min = d.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${anio} ${hora}:${min}`;
}

mostrarLogin();
