// =================================================================
// CONEXIÓN RPC Y PROCEDIMIENTOS
// =================================================================

var app_rpc = rpc("localhost", "hospital_rpc");

var loginSanitario = app_rpc.procedure("loginSanitario");
var crearSanitario = app_rpc.procedure("crearSanitario");
var obtenerSanitario = app_rpc.procedure("obtenerSanitario");
var obtenerCategorias = app_rpc.procedure("obtenerCategorias");
var obtenerReservas = app_rpc.procedure("obtenerReservas");
var obtenerModelos = app_rpc.procedure("obtenerModelos");
var obtenerRecursosFiltrados = app_rpc.procedure("obtenerRecursosFiltrados");
var reservarRecurso = app_rpc.procedure("reservarRecurso");
var iniciarReserva = app_rpc.procedure("iniciarReserva");
var finalizarReserva = app_rpc.procedure("finalizarReserva");
var cancelarReserva = app_rpc.procedure("cancelarReserva");
var crearResenya = app_rpc.procedure("crearResenya");
var actualizarSanitario = app_rpc.procedure("actualizarSanitario");

var sanitarioActual = null;
var app = document.getElementById("app");
var textoUsuario = document.getElementById("textoUsuario");

// =================================================================
// WEBSOCKET
// =================================================================

var ws = null;
var avisosSanitario = [];

function abrirWS(idSanitario) {
    ws = new WebSocket("ws://localhost:3502");

    // Cuando el sanitario se conecte, registrarlo en el array de sanitarios del WS del servidor.
    ws.onopen = function () {
        console.log("WS: Conexión abierta (sanitario)");
        ws.send(JSON.stringify({tipo: "registro", rol: "sanitario", id: idSanitario}));
    };

    // Cuando llegue un aviso, añadirlo a la tabla y actualizarla.
    ws.onmessage = function (evento) {
        var msg = JSON.parse(evento.data);
        if (msg.tipo === "aviso") {
            avisosSanitario.push(msg);
            actualizarTablaAvisos();
        }
    };

    ws.onclose = function () {
        console.log("WS: Conexión cerrada (sanitario)");
    };

}

// Función para cerrar el WS cuando el sanitario haga logout.
function cerrarWS() {
    if (ws) {
        ws.close();
        ws = null;
    }
    avisosSanitario = [];
}

// Actualiza la tabla de avisos del sanitario.
function actualizarTablaAvisos() {
    var contenedor = document.getElementById("tablaAvisos");
    if (!contenedor) return;

    if (avisosSanitario.length === 0) {
        contenedor.innerHTML = "<p style='color:var(--muted); font-size:14px;'>No hay avisos recibidos.</p>";
        return;
    }

    var filas = avisosSanitario.map(function (aviso) {
        var colorFondo;
        if (aviso.color === "verde") {
            colorFondo = "var(--aviso-verde)";
        } else if (aviso.color === "azul") {
            colorFondo = "var(--aviso-azul)";
        } else {
            colorFondo = "var(--aviso-rojo)";
        }
        return "<tr style='background:" + colorFondo + ";'>" +
            "<td data-label='Fecha'>" + formatearFecha(aviso.fecha) + "</td>" +
            "<td data-label='Origen'>" + aviso.origen + "</td>" +
            "<td data-label='Aviso'>" + aviso.texto + "</td>" +
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

// Muestra el formulario de login de sanitario.
function mostrarLogin() {
    textoUsuario.innerHTML = "";
    app.innerHTML = `
        <h1 class="login-title">Portal del sanitario</h1>
        <div class="card">
            <h2>Inicio de sesión</h2>
            <div class="row">
                <div class="field">
                    <label>Usuario</label>
                    <input id="user_login">
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

// Inicio de sesión
function login() {
    var user_log = document.getElementById("user_login").value;
    var password_log = document.getElementById("password_login").value;

    loginSanitario(user_log, password_log, function(id) {
        if (id) {
            sanitarioActual = id;
            abrirWS(sanitarioActual); // Abrir WebSocket tras login exitoso
            mostrarHome();
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
}

// Muestra el formulario de registro de sanitario.
function mostrarRegistro() {
    app.innerHTML = `
        <h1 class="login-title">Portal del sanitario</h1>
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
                    <input id="user_registro">
                </div>
                <div class="field">
                    <label>Contraseña</label>
                    <input type="password" id="password_registro">
                </div>
            </div>
            <div class="actions">
                <button class="success" onclick="registro()">Registrar</button>
                <button onclick="mostrarLogin()">Volver</button>
            </div>
        </div>
    `;
}

function registro() {
    var nombre_reg = document.getElementById("nombre_registro").value;
    var apellidos_reg = document.getElementById("apellidos_registro").value;
    var user_reg = document.getElementById("user_registro").value;
    var password_reg = document.getElementById("password_registro").value;

    if (!nombre_reg || !apellidos_reg || !user_reg || !password_reg) {
        alert("Por favor, rellena los campos obligatorios");
        return;
    }

    crearSanitario(nombre_reg, apellidos_reg, user_reg, password_reg, function(id) {
        if (id) {
            alert("¡Registro completado!");
            mostrarLogin();
        } else {
            alert("Error: El usuario ya existe o los datos son incorrectos");
        }
    });
}

// Carga los datos del sanitario
function cargar() {
    obtenerReservas(sanitarioActual, function (reservas) {
        mostrarTablas(reservas);
    });
}

// Construye las tablas del sanitario
function mostrarTablas(listaReservas) {
    var tablaPendientes = document.getElementById("tablaPendientes");
    var tablaRealizadas = document.getElementById("tablaRealizadas");

    tablaPendientes.innerHTML = "";
    tablaRealizadas.innerHTML = "";

    for (var i = 0; i < listaReservas.length; i++) {
        var reserva = listaReservas[i];

        if (!reserva.fecha_inicio) {
            tablaPendientes.innerHTML += `
                <tr>
                    <td data-label="Recurso">${reserva.recurso}</td>
                    <td data-label="Fecha de petición">${formatearFecha(reserva.fecha_peticion)}</td>
                    <td><button onclick="retirar(${reserva.id})">Retirar</button></td>
                    <td><button class="danger" onclick="cancelar(${reserva.id})">X</button></td>
                </tr>
            `;
        } else {
            var casilla_fin = (reserva.fecha_fin != null)
                ? formatearFecha(reserva.fecha_fin)
                : `<button onclick="devolver(${reserva.id})">Devolver</button>`;

            tablaRealizadas.innerHTML += `
                <tr>
                    <td data-label="Recurso">${reserva.recurso}</td>
                    <td data-label="Fecha de inicio">${formatearFecha(reserva.fecha_inicio)}</td>
                    <td data-label="Fecha de devolución">${casilla_fin}</td>
                    <td>
                        <button onclick="prepararResenya(${reserva.recurso})">Reseña</button>
                    </td>
                </tr>
            `;
        }
    }
}

// Construye la pantalla principal del sanitario
function mostrarHome() {
    obtenerSanitario(sanitarioActual, function(s) {
        textoUsuario.innerHTML = `
            ${s.nombre} ${s.apellidos}
            <button onclick="editarPerfil()">Editar perfil</button>
            <button onclick="logout()">Salir</button>
        `;
    });

    app.innerHTML = `
        <h1 class="login-title">Portal del sanitario</h1>
        <div class="card">
            <h2>Reservas Pendientes</h2>
            <table>
                <thead>
                    <tr><th>Recurso</th><th>Fecha de petición</th><th>Retirar</th><th>Cancelar</th></tr>
                </thead>
                <tbody id="tablaPendientes"></tbody>
            </table>
        </div>

        <div class="card">
            <h2>Reservas realizadas</h2>
            <table>
                <thead>
                    <tr><th>Recurso</th><th>Fecha de inicio</th><th>Fecha de devolución</th><th>Reseña</th></tr>
                </thead>
                <tbody id="tablaRealizadas"></tbody>
            </table>
            <br>
            <button class="primary" onclick="nuevaReserva()">Nueva Reserva</button>
        </div>

        <div class="card">
            <h2>Avisos recibidos</h2>
            <div id="tablaAvisos"></div>
        </div>
    `;

    cargar();
    actualizarTablaAvisos();
}

// Construye la pantalla de editar datos del sanitario
function editarPerfil() {
    app.innerHTML = `
        <h1 class="login-title">Portal del sanitario</h1>
        <div class="card">
            <h2>Editar perfil</h2>
            <div class="row">
                <div class="field">
                    <label>Nombre</label>
                    <input id="ep_nombre">
                </div>
                <div class="field">
                    <label>Apellidos</label>
                    <input id="ep_apellidos">
                </div>
            </div>
            <div class="row">
                <div class="field">
                    <label>Usuario</label>
                    <input id="ep_usuario">
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

    obtenerSanitario(sanitarioActual, function(s) {
        document.getElementById("ep_nombre").value = s.nombre;
        document.getElementById("ep_apellidos").value = s.apellidos;
        document.getElementById("ep_usuario").value = s.usuario;
    });
}

// Guarda los datos editados del sanitario.
function guardarPerfil() {
    var nombre = document.getElementById("ep_nombre").value;
    var apellidos = document.getElementById("ep_apellidos").value;
    var usuario = document.getElementById("ep_usuario").value;
    var password = document.getElementById("ep_password").value;

    actualizarSanitario(sanitarioActual, nombre, apellidos, usuario, password, function(resultado) {
        if (resultado) {
            alert("Perfil actualizado correctamente.");
            mostrarHome();
        } else {
            alert("Error: el usuario ya existe o los datos son incorrectos.");
        }
    });
}

// Avisa al servidor de que el sanitario ha retirado un equipo.
function retirar(idReserva) {
    iniciarReserva(idReserva, function(resultado) {
        if (resultado) {
            // Notificar via WS que se ha iniciado la reserva
            // Necesitamos el idRecurso: lo buscamos en la vista o re-cargamos
            obtenerReservas(sanitarioActual, function(reservas) {
                for (var i = 0; i < reservas.length; i++) {
                    if (reservas[i].id == idReserva) {
                        enviarAvisoReserva(idReserva, reservas[i].recurso, "iniciada");
                        break;
                    }
                }
                cargar();
            });
        } else {
            alert("No se ha podido retirar el recurso");
        }
    });
}

// Avisa al servidor de que el sanitario ha devuelto un equipo.
function devolver(idReserva) {
    finalizarReserva(idReserva, function(resultado) {
        if (resultado) {
            // Notificar via WS que se ha finalizado la reserva
            obtenerReservas(sanitarioActual, function(reservas) {
                for (var i = 0; i < reservas.length; i++) {
                    if (reservas[i].id == idReserva) {
                        enviarAvisoReserva(idReserva, reservas[i].recurso, "finalizada");
                        break;
                    }
                }
                cargar();
            });
        } else {
            alert("Error al devolver el recurso");
        }
    });
}

// Envía el aviso de inicio/fin de reserva al servidor WS.
function enviarAvisoReserva(idReserva, idRecurso, accion) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            tipo: "reservaActualizada",
            accion: accion,
            idReserva: idReserva,
            idRecurso: idRecurso,
            idSanitario: sanitarioActual
        }));
    }
}

// Avisa al servidor de que el sanitario ha cancelado una reserva.
function cancelar(idReserva) {
    var seguro = confirm("¿Estás seguro de que quieres borrar esta reserva?");
    if (seguro) {
        cancelarReserva(idReserva, function(resultado) {
            if (resultado) {
                cargar();
            } else {
                alert("No se ha podido cancelar la reserva");
            }
        });
    }
}

// Cierra la sesión del sanitario.
function logout() {
    cerrarWS();
    sanitarioActual = null;
    mostrarLogin();
}

// Gestiona la pantalla de nueva reserva.
function nuevaReserva() {
    app.innerHTML = `
        <h1 class="login-title">Portal del sanitario</h1>
        <div class="card">
            <h2>Nueva Reserva</h2>
            <div class="row">
                <div class="field">
                    <label>Categoría</label>
                    <select id="sel_cat" onchange="actualizarModelos()"></select>
                </div>
                <div class="field">
                    <label>Modelo</label>
                    <select id="sel_mod"></select>
                </div>
                <div class="field">
                    <label>Horas estimadas</label>
                    <input type="number" id="num_horas" value="1" min="1">
                </div>
            </div>
            <div class="actions">
                <button class="primary" onclick="buscarParaReservar()">Buscar Disponibles</button>
                <button onclick="mostrarHome()">Volver</button>
            </div>

            <hr>
            <table id="tablaBusqueda">
                <thead>
                    <tr>
                        <th>N. Serie</th>
                        <th>Ubicación</th>
                        <th>Valoración</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody id="cuerpoBusqueda"></tbody>
            </table>
        </div>
    `;

    obtenerCategorias(function(cats) {
    var sel = document.getElementById("sel_cat");
    if (!sel) return;
    sel.innerHTML = "";
    for (var i = 0; i < cats.length; i++) {
        sel.innerHTML += `<option value="${cats[i].id}">${cats[i].nombre}</option>`;
    }
    actualizarModelos();

    // Cargar todos los recursos al inicio
    obtenerModelos(function(listaModelos) {
        var resultadoTotal = [];

        document.getElementById("tablaBusqueda").style.display = "";
        var cuerpo = document.getElementById("cuerpoBusqueda");
        cuerpo.innerHTML = "<tr><td colspan='5'>Cargando...</td></tr>";

        var i = 0;
        function siguienteModelo() {
            if (i >= listaModelos.length) {
                mostrarResultados(resultadoTotal);
                return;
            }
            obtenerRecursosFiltrados(listaModelos[i].id, function(lista) {
                resultadoTotal = resultadoTotal.concat(lista);
                i++;
                siguienteModelo();
            });
        }
        siguienteModelo();
    });
});
}

function mostrarResultados(lista) {
    obtenerReservas(sanitarioActual, function(misReservas) {
        var cuerpo = document.getElementById("cuerpoBusqueda");
        if (!cuerpo) return;
        cuerpo.innerHTML = "";

        if (lista.length === 0) {
            cuerpo.innerHTML = "<tr><td colspan='5'>No hay recursos operativos.</td></tr>";
            return;
        }

        for (var i = 0; i < lista.length; i++) {
            var rec = lista[i];

            var yaReservado = false;
            for (var j = 0; j < misReservas.length; j++) {
                if (misReservas[j].recurso == rec.id && misReservas[j].fecha_fin == null) {
                    yaReservado = true;
                    break;
                }
            }

            var botonAccion;
            if (yaReservado) {
                botonAccion = `<button class="primary" disabled style="opacity:0.6; cursor:not-allowed;">Ya reservado</button>`;
            } else if (rec.disponible) {
                botonAccion = `<button class="success" onclick="ejecutarReserva(${rec.id}, true)">Retirar</button>`;
            } else {
                botonAccion = `<button class="primary" onclick="ejecutarReserva(${rec.id}, false)">Reservar</button>`;
            }

            cuerpo.innerHTML += `
                <tr>
                    <td data-label="N. Serie">${rec.numero_serie}</td>
                    <td data-label="Ubicación">${rec.ubicacion_nombre}</td>
                    <td data-label="Valoración" style="text-align:center;"><strong>${rec.valoracion}</strong></td>
                    <td data-label="Estado">${rec.estado_texto}</td>
                    <td>${botonAccion}</td>
                </tr>
            `;
        }
    });
}

// Obtiene los recursos de un modelo y determina si se puede reservar o retirar.
function buscarParaReservar() {
    var idMod = document.getElementById("sel_mod").value;

    document.getElementById("tablaBusqueda").style.display = "";
    var cuerpo = document.getElementById("cuerpoBusqueda");
    cuerpo.innerHTML = "<tr><td colspan='5'>Cargando recursos operativos...</td></tr>";

    obtenerRecursosFiltrados(idMod, function(lista) {
        mostrarResultados(lista);
    });
}

// Finaliza la reserva.
function ejecutarReserva(idRecurso, retirarInmediatamente) {
    var horas = document.getElementById("num_horas").value;

    var datosReserva = {
        recurso: idRecurso,
        sanitario: sanitarioActual,
        horas_estimadas: parseInt(horas),
        retirar: retirarInmediatamente
    };

    reservarRecurso(datosReserva, function(idReserva) {
        if (idReserva) {
            // Si se retira inmediatamente, notificar via WS
            if (retirarInmediatamente) {
                enviarAvisoReserva(idReserva, idRecurso, "iniciada");
            }
            alert("Operación realizada con éxito");
            mostrarHome();
        } else {
            alert("No se ha podido realizar la reserva");
        }
    });
}

// Muestra el formulario para escribir una reseña.
function prepararResenya(idRecurso) {
    app.innerHTML = `
        <h1 class="login-title">Portal del sanitario</h1>
        <div class="card">
            <h2>Nueva Reseña</h2>
            <div class="field">
                <label>Puntuación (1-5)</label>
                <select id="res_valor">
                    <option value="5">5 - Excelente</option>
                    <option value="4">4 - Muy bueno</option>
                    <option value="3">3 - Normal</option>
                    <option value="2">2 - Malo</option>
                    <option value="1">1 - Pésimo</option>
                </select>
            </div>
            <div class="field">
                <label>Comentario</label>
                <textarea id="res_texto" rows="4"></textarea>
            </div>
            <button class="success" onclick="guardarResenya(${idRecurso})">Guardar Reseña</button>
            <button onclick="mostrarHome()">Cancelar</button>
        </div>
    `;
}

// Envía la reseña al servidor y notifica via WS a los gestores.
function guardarResenya(idRecurso) {
    var valor = document.getElementById("res_valor").value;
    var texto = document.getElementById("res_texto").value;

    crearResenya(idRecurso, sanitarioActual, valor, texto, function(id) {
        if (id) {
            // Notificar via WS a todos los gestores conectados
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    tipo: "nuevaResenya",
                    idRecurso: idRecurso,
                    idSanitario: sanitarioActual,
                    puntuacion: valor
                }));
            }
            alert("¡Gracias por tu valoración!");
            mostrarHome();
        } else {
            alert("Error al guardar la reseña");
        }
    });
}

// Filtra los modelos según la categoría elegida.
function actualizarModelos() {
    var idCat = document.getElementById("sel_cat").value;
    var selMod = document.getElementById("sel_mod");

    selMod.innerHTML = "<option>Cargando modelos...</option>";

    obtenerModelos(function(listaModelos) {
        selMod.innerHTML = "";

        var hayModelos = false;
        for (var i = 0; i < listaModelos.length; i++) {
            if (listaModelos[i].categoria == idCat) {
                selMod.innerHTML += `<option value="${listaModelos[i].id}">${listaModelos[i].nombre}</option>`;
                hayModelos = true;
            }
        }

        if (!hayModelos) {
            selMod.innerHTML = "<option value='-1'>No hay modelos disponibles</option>";
        }
    });
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
