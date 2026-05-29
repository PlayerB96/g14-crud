export const ESTADOS = ['REGISTRADO', 'PAGADO', 'CANCELADO', 'ENVIADO', 'ENTREGADO'];

export function estadoClass(estado) {
  return `estado-select estado-${(estado ?? '').toLowerCase()}`;
}
