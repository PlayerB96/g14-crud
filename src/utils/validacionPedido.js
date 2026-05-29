/** Validación y transformación del formulario controlado de pedidos */

export const FORMULARIO_VACIO = {
  cliente: '',
  correoCliente: '',
  productoId: '',
  nombreProducto: '',
  cantidad: '',
  precioUnitario: '',
};

export function pedidoAFormulario(pedido) {
  return {
    cliente: pedido.cliente ?? '',
    correoCliente: pedido.correoCliente ?? '',
    productoId: String(pedido.productoId ?? ''),
    nombreProducto: pedido.nombreProducto ?? '',
    cantidad: String(pedido.cantidad ?? ''),
    precioUnitario: String(pedido.precioUnitario ?? ''),
  };
}

export function validarFormulario(values) {
  const errores = {};
  const cliente = values.cliente.trim();
  const correo = values.correoCliente.trim();
  const producto = values.nombreProducto.trim();
  const productoId = Number(values.productoId);
  const cantidad = Number(values.cantidad);
  const precio = Number(values.precioUnitario);

  if (!cliente) errores.cliente = 'El cliente es obligatorio';
  if (!correo) errores.correoCliente = 'El correo es obligatorio';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    errores.correoCliente = 'Correo no válido';
  }
  if (!producto) errores.nombreProducto = 'El producto es obligatorio';
  if (values.productoId === '' || Number.isNaN(productoId) || productoId < 1) {
    errores.productoId = 'ID de producto inválido';
  }
  if (values.cantidad === '' || Number.isNaN(cantidad) || cantidad < 1) {
    errores.cantidad = 'Cantidad mínima: 1';
  }
  if (values.precioUnitario === '' || Number.isNaN(precio) || precio <= 0) {
    errores.precioUnitario = 'Precio debe ser mayor a 0';
  }

  return errores;
}

export function formularioAApi(values) {
  return {
    cliente: values.cliente.trim(),
    correoCliente: values.correoCliente.trim(),
    productoId: Number(values.productoId),
    nombreProducto: values.nombreProducto.trim(),
    cantidad: Number(values.cantidad),
    precioUnitario: Number(values.precioUnitario),
  };
}
