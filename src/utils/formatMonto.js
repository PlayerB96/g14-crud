/** Montos en soles peruanos (PEN) */
const monto = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
});

export function formatMonto(valor) {
  return monto.format(valor ?? 0);
}
