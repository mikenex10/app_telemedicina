// Con la versión 2 de la librería se pueden procedimientos en el servidor que sean asíncronos


var rpc = require("./rpc.js");   //libreria rpc del servidor
var conexionBD = require('./conexion_mysql.js'); // conexión a la base de datos
rpc.debug = true;

var servidor = rpc.server(); // crear el servidor RPC
var app = servidor.createApp("prueba_RPC"); // creamos la aplicación RPC

// ---------------------
// - VERSIÓN ASÍNCRONA -
// ---------------------

// Obtiene los datos de un determinado hospital
function obtenerDatosHospital(id, callback) { // hay un parámetro adicional (siempre el último) que es la función callback. SIEMPRE hay que llamar callback
    conexionBD.query("SELECT * FROM hospitales WHERE id = " + id, function (error, datos) {
        if (error) {
            callback(null); // error en la consulta
        } else {
            if (datos.length == 0) {
                callback(null); // no lo ha encontrado 
            } else {
                callback(datos[0]); // devuelvo el hospital que estará en la primera y única posición del array
            }
        }
    });
}

// Introduce los datos de un nuevo hospital
function nuevoHospital(nombre, localidad, camas, callback) { // hay un parámetro adicional (siempre el último) que es la función callback. SIEMPRE hay que llamar callback
    console.log(nombre, localidad, camas, callback);
    conexionBD.query("INSERT INTO hospitales (nombre, provincia, camas) VALUES ('" + nombre + "','" + localidad + "'," + camas + ")", function (error, datos) {
        if (error) {
            console.log("Error:", error);
            callback(null); // error en la consulta
        } else {
            callback(datos.insertId); // devuelvo el id del hospital insertado
        }
    });
}

app.registerAsync(obtenerDatosHospital); // si no se registra con registerAsync no funcionará
app.registerAsync(nuevoHospital);