/**
 * READ — Tabla con el listado de pedidos (props desde App)
 * También: select de estado (PATCH) y botones editar / eliminar
 */
import { Pencil, Trash2 } from 'lucide-react';
import { ESTADOS, estadoClass } from '../constants/estados';
import { formatMonto } from '../utils/formatMonto';

function formatearFecha(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-GT', { dateStyle: 'short', timeStyle: 'short' });
}

export default function PedidoList({
  pedidos,
  cargando,
  idGuardandoEstado,
  alEditar,
  alCambiarEstado,
  alEliminar,
}) {
  if (cargando) {
    return (
      <div className="table-empty">
        <div className="spinner" aria-hidden="true" />
        <p>Cargando pedidos…</p>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="table-empty">
        <p className="empty-title">Sin pedidos</p>
        <p className="empty-hint">Pulsa «Nuevo pedido» para crear el primero.</p>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table className="pedidos-table">
        <thead>
          <tr>
            <th className="col-actions-left" aria-label="Acciones" />
            <th>#</th>
            <th>Cliente</th>
            <th>Correo</th>
            <th>Producto</th>
            <th>Cant.</th>
            <th>P. unit.</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => {
            const guardando = String(idGuardandoEstado) === String(pedido.id);

            return (
              <tr key={pedido.id} className={guardando ? 'row-saving' : ''}>
                <td className="col-actions-left">
                  <div className="row-actions">
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => alEditar(pedido)}
                      disabled={guardando}
                      title="Editar"
                      aria-label={`Editar pedido ${pedido.id}`}
                    >
                      <Pencil size={16} strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-icon-danger"
                      onClick={() => alEliminar(pedido)}
                      disabled={guardando}
                      title="Eliminar"
                      aria-label={`Eliminar pedido ${pedido.id}`}
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                  </div>
                </td>
                <td className="col-id">{pedido.id}</td>
                <td className="col-cliente"><strong>{pedido.cliente}</strong></td>
                <td className="col-correo">{pedido.correoCliente}</td>
                <td className="col-producto">{pedido.nombreProducto}</td>
                <td className="col-num">{pedido.cantidad}</td>
                <td className="col-num col-precio">{formatMonto(pedido.precioUnitario)}</td>
                <td className="col-total">{formatMonto(pedido.total)}</td>
                <td className="col-estado">
                  <select
                    className={estadoClass(pedido.estado)}
                    value={pedido.estado ?? 'REGISTRADO'}
                    disabled={guardando}
                    onChange={(e) => alCambiarEstado(pedido, e.target.value)}
                    aria-label={`Estado pedido ${pedido.id}`}
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </td>
                <td className="col-fecha">{formatearFecha(pedido.fechaPedido)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
