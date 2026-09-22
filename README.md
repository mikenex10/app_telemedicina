# App Telemedicina

Aplicación de gestión y reserva de recursos sanitarios (termómetros, sillas de ruedas, estetoscopios, etc.) para centros de salud. Permite a los sanitarios consultar recursos disponibles, reservarlos y recibir avisos en tiempo real sobre el estado de sus reservas.

## Estructura del proyecto

```
app_telemedicina/
├── datos.js              # "Base de datos" en memoria (sanitarios, gestores, ubicaciones, categorías, modelos, recursos, reservas, reseñas)
├── servidor.js            # Arranca los tres servidores (REST + RPC + WebSocket)
├── servidor_rest.js        # API REST (Express) — puerto 3000
├── servidor_rpc.js         # API estilo RPC — puerto 3501
├── servidor_ws.js          # Servidor WebSocket para notificaciones en tiempo real — puerto 3502
├── rpc.js                  # Utilidades del servidor RPC
├── cliente_rest/           # Cliente web que consume la API REST
└── cliente_rpc/            # Cliente web que consume la API RPC
```

## Requisitos

- Node.js
- npm

## Instalación

```bash
npm install
```

## Uso

Arrancar todos los servidores (REST, RPC y WebSocket):

```bash
node servidor.js
```

- Cliente REST: http://localhost:3000/appCliente
- API RPC: puerto 3501
- WebSocket (notificaciones en tiempo real): puerto 3502

## Tecnologías

- [Express](https://expressjs.com/) — servidor REST
- [ws](https://github.com/websockets/ws) — servidor WebSocket
- [cors](https://www.npmjs.com/package/cors)
