# Guía para la exposición — G14 CRUD Pedidos

## 1. Qué demuestra el proyecto (criterios MVP)

| Criterio | Dónde está | Tecnología |
|----------|------------|------------|
| **READ** (listar) | `App.jsx` → `useEffect` + `PedidoList.jsx` | `GET /api/pedidos` |
| **CREATE** (crear) | `PedidoFormCreate.jsx` | Formulario controlado + `POST` |
| **UPDATE** (editar) | `PedidoFormEdit.jsx` | `GET` por id + `PUT` |
| **DELETE** (eliminar) | `App.jsx` → `eliminarPedido` | `window.confirm` + `DELETE` |
| **UI** | `global.css` | Tabla desktop + columnas adaptables en móvil |

**Solo se usa:** `useState`, `useEffect`, `fetch`, componentes y props.  
**No se usa:** Context, useReducer, Map.

---

## 2. Estructura del código (orden sugerido para explicar)

```
src/
├── main.jsx              → Punto de entrada React
├── App.jsx               → Estado global y orquestación CRUD
├── services/api.js       → Todas las peticiones HTTP (Fetch)
├── components/
│   ├── PedidoList.jsx    → READ: tabla
│   ├── PedidoFormCreate.jsx → CREATE: formulario + validación
│   ├── PedidoFormEdit.jsx   → UPDATE: carga + formulario + PUT
│   ├── PedidoCampos.jsx     → Inputs controlados (reutilizados)
│   └── Modal.jsx            → Ventana para crear/editar
└── utils/validacionPedido.js → Reglas del formulario
```

---

## 3. Flujo por operación (qué decir en voz alta)

### READ
1. Al abrir la app, `useEffect` en `App.jsx` ejecuta `getPedidos()`.
2. La respuesta se guarda en `useState` → `pedidos`.
3. `PedidoList` recibe `pedidos` por **props** y los pinta en la tabla.

### CREATE
1. Botón «Nuevo pedido» abre el **modal**.
2. `PedidoFormCreate` usa `useState` para cada campo (`value` + `onChange` = formulario controlado).
3. Al enviar: `validarFormulario()` → si ok → `postPedido()` → se añade a la lista.

### UPDATE
1. Icono lápiz → modal con `PedidoFormEdit`.
2. `useEffect` hace `getPedidoPorId(id)` y llena el formulario.
3. Al guardar: `putPedido(id, datos)` → actualiza la fila en la tabla.
4. Extra: el `<select>` de estado usa `patchEstadoPedido()` (PATCH).

### DELETE
1. Icono papelera → confirmación con **SweetAlert2** (`confirmarEliminar.js`).
2. Si el usuario acepta → `deletePedido(id)` → se quita de la lista.

---

## 4. Fetch API (api.js)

```text
GET    /api/pedidos          → getPedidos()
GET    /api/pedidos/:id      → getPedidoPorId(id)
POST   /api/pedidos          → postPedido(datos)
PUT    /api/pedidos/:id      → putPedido(id, datos)
PATCH  /api/pedidos/:id/estado → patchEstadoPedido(id, estado)
DELETE /api/pedidos/:id      → deletePedido(id)
```

---

## 5. Demo en vivo (2 minutos)

1. Mostrar tabla cargada (READ).
2. Crear un pedido (CREATE).
3. Editar cantidad o precio (UPDATE + PUT).
4. Cambiar estado en el select (PATCH).
5. Eliminar con confirmación (DELETE).
6. Recargar con el icono (nuevo `useEffect` por `recargar`).

---

## 6. Preguntas frecuentes del jurado

**¿Por qué no usaron Context?**  
El MVP pide solo `useState`/`useEffect`; el estado vive en `App` y baja por props.

**¿Qué es un formulario controlado?**  
El valor del input viene de `useState` y cada tecla actualiza ese estado con `onChange`.

**¿Cómo evitan CORS en desarrollo?**  
Vite hace proxy: el navegador llama `/api` y Vite reenvía a Render (`vite.config.js`).
