import Swal from 'sweetalert2';

export async function confirmarEliminarPedido(pedido) {
  const resultado = await Swal.fire({
    title: '¿Cancelar pedido?',
    html: `El pedido <strong>#${pedido.id}</strong> pasará a estado <strong>CANCELADO</strong> y dejará de mostrarse.<br/>${pedido.cliente} — ${pedido.nombreProducto}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    reverseButtons: true,
    focusCancel: true,
  });

  return resultado.isConfirmed;
}
