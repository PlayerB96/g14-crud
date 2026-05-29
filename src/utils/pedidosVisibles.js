/** El backend hace borrado lógico: DELETE → estado CANCELADO */
export const ESTADO_CANCELADO = 'CANCELADO';

export function esPedidoVisible(pedido) {
  return pedido?.estado !== ESTADO_CANCELADO;
}

export function filtrarPedidosVisibles(pedidos) {
  if (!Array.isArray(pedidos)) return [];
  return pedidos.filter(esPedidoVisible);
}
