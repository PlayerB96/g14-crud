/**
 * Capa API — Fetch API (GET, POST, PUT, PATCH, DELETE)
 * Base: VITE_API_BASE_URL → /api/pedidos
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

function urlPedidos(rutaExtra = '') {
  const base = API_BASE.replace(/\/$/, '');
  const extra = rutaExtra ? `/${rutaExtra}` : '';
  return `${base}/pedidos${extra}`;
}

async function fetchApi(url, opciones) {
  try {
    return await fetch(url, opciones);
  } catch {
    throw new Error(
      'No se pudo conectar con la API. Usa http://localhost:5173 y reinicia pnpm run dev',
    );
  }
}

async function leerJson(response) {
  if (!response.ok) {
    let mensaje = `Error ${response.status}`;
    try {
      const body = await response.json();
      if (body?.message) mensaje = body.message;
      else if (body?.mensaje) mensaje = body.mensaje;
    } catch {
      /* sin JSON */
    }
    throw new Error(mensaje);
  }
  if (response.status === 204) return null;
  const texto = (await response.text()).trim();
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

// READ — GET /api/pedidos
export function getPedidos() {
  return fetchApi(urlPedidos()).then(leerJson);
}

// READ — GET /api/pedidos/:id
export function getPedidoPorId(id) {
  return fetchApi(urlPedidos(String(id))).then(leerJson);
}

// CREATE — POST /api/pedidos
export function postPedido(datos) {
  return fetchApi(urlPedidos(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  }).then(leerJson);
}

// UPDATE — PUT /api/pedidos/:id
export function putPedido(id, datos) {
  return fetchApi(urlPedidos(String(id)), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  }).then(leerJson);
}

// UPDATE (estado) — PATCH /api/pedidos/:id/estado
export function patchEstadoPedido(id, estado) {
  return fetchApi(urlPedidos(`${id}/estado`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado }),
  }).then(leerJson);
}

// DELETE — DELETE /api/pedidos/:id
export function deletePedido(id) {
  return fetchApi(urlPedidos(String(id)), { method: 'DELETE' }).then((response) =>
    leerJson(response),
  );
}
