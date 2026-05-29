# G14 — CRUD de Pedidos (MVP)

Aplicación React que cumple las **4 operaciones CRUD** sobre el recurso `pedidos`, conectada a la API en Render.

## Criterios MVP

| Operación | Implementación |
|-----------|----------------|
| **Read** | Tabla `PedidoList` + `GET /api/pedidos` |
| **Create** | Modal + formulario controlado + validación + `POST` |
| **Update** | Modal edición + `GET` por id + `PUT` |
| **Delete** | `window.confirm` + `DELETE` |

**Stack:** React, `useState`, `useEffect`, Fetch API. Sin Context, Reducer ni Map.

## Inicio

```bash
pnpm install
cp .env.example .env.local
pnpm run dev
```

Abrir http://localhost:5173

## Estructura

Ver **[GUIA_EXPOSICION.md](./GUIA_EXPOSICION.md)** para explicar el proyecto en clase.

## API

`https://ms-pedidos-q7pm.onrender.com/api/pedidos`

En desarrollo: `VITE_API_BASE_URL="/api"` (proxy en `vite.config.js`).
