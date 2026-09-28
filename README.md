# App Telemedicina

Aplicación de gestión y reserva de recursos sanitarios (termómetros, sillas de ruedas, estetoscopios, etc.) para centros de salud. Permite a los sanitarios consultar recursos disponibles, reservarlos y recibir avisos en tiempo real sobre el estado de sus reservas.

## Estructura del proyecto

```
app_telemedicina/
├── telemedicina2026.sql      # Volcado de la base de datos MySQL (estructura y datos iniciales)
├── conexion_mysql.js         # Conexión a la base de datos MySQL
├── datos.js                  # "Base de datos" en memoria (antigua; aún la usa WebSocket)
├── servidor.js               # Arranca los tres servidores (REST + RPC + WebSocket)
├── servidor_rest.js          # API REST (Express) con MySQL — puerto 3000
├── servidor_rest_old.js      # Versión anterior de la API REST, que usaba datos.js
├── ejemplo_servidor_rest.js  # Ejemplo de referencia de servidor REST con MySQL
├── servidor_rpc.js           # API estilo RPC con MySQL — puerto 3501
├── servidor_rpc_old.js       # Versión anterior de la API RPC, que usaba datos.js
├── ejemplo_servidor_rpc.js   # Ejemplo de referencia de servidor RPC con MySQL
├── servidor_ws.js            # Servidor WebSocket para notificaciones en tiempo real — puerto 3502
├── rpc.js                    # Utilidades del servidor RPC
├── cliente_rest/             # Cliente web que consume la API REST
└── cliente_rpc/              # Cliente web que consume la API RPC
```

## Requisitos

- Node.js
- npm
- MySQL o MariaDB (por ejemplo, con [XAMPP](https://www.apachefriends.org/) y phpMyAdmin)

## Instalación

### 1. Dependencias

```bash
npm install
```

### 2. Base de datos

1. Arranca MySQL (en XAMPP: *Manage Servers* → *MySQL Database* → *Start*).
2. En phpMyAdmin, crea una base de datos llamada `telemedicina2026`.
3. Selecciona esa base de datos, ve a la pestaña **Importar** y carga el archivo `telemedicina2026.sql`.

### 3. Usuario de MySQL

La aplicación se conecta con el usuario `tele2026` y la contraseña `2026tele` (ver `conexion_mysql.js`). El volcado SQL no incluye usuarios, así que hay que crearlo a mano. En phpMyAdmin, pestaña **SQL**:

```sql
CREATE USER 'tele2026'@'localhost' IDENTIFIED BY '2026tele';
GRANT ALL PRIVILEGES ON telemedicina2026.* TO 'tele2026'@'localhost';
```

> El usuario debe crearse con host `localhost`. Si se crea solo con host `%` (cualquier host), la cuenta anónima que XAMPP trae por defecto tiene prioridad al conectar desde `localhost` y el acceso falla con `Access denied for user 'tele2026'@'localhost'`.

## Uso

Arrancar todos los servidores (REST, RPC y WebSocket):

```bash
node servidor.js
```

- Cliente REST: http://localhost:3000/appCliente
- API RPC: puerto 3501
- WebSocket (notificaciones en tiempo real): puerto 3502

## Estado de la migración a MySQL

| Servidor | Fuente de datos |
|---|---|
| REST (`servidor_rest.js`) | MySQL |
| RPC (`servidor_rpc.js`) | MySQL |
| WebSocket (`servidor_ws.js`) | `datos.js` (en memoria) |

Mientras WebSocket no esté migrado, los avisos en tiempo real solo conocen los datos iniciales de `datos.js`: los recursos, reservas o sanitarios creados desde los clientes REST o RPC (en MySQL) aparecen como desconocidos en los avisos.

## Tecnologías

- [Express](https://expressjs.com/): servidor REST
- [mysql](https://www.npmjs.com/package/mysql): conexión a la base de datos
- [ws](https://github.com/websockets/ws): servidor WebSocket
- [cors](https://www.npmjs.com/package/cors)
