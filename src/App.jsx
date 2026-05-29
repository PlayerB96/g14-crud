/**
 * App principal — CRUD de pedidos
 *
 * React: useState (estado) + useEffect (cargar lista)
 * Sin Context, Reducer ni Map
 *
 * READ    → useEffect + getPedidos()     → PedidoList
 * CREATE  → PedidoFormCreate + postPedido()
 * UPDATE  → PedidoFormEdit + getPedidoPorId() + putPedido()
 * DELETE  → SweetAlert + deletePedido() (borrado lógico → CANCELADO)
 */
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import PedidoList from './components/PedidoList';
import PedidoFormCreate from './components/PedidoFormCreate';
import PedidoFormEdit from './components/PedidoFormEdit';
import Modal from './components/Modal';
import {
  deletePedido,
  getPedidos,
  patchEstadoPedido,
  postPedido,
} from './services/api';
import { formatUltimaActualizacion } from './utils/formatFecha';
import { confirmarEliminarPedido } from './utils/confirmarEliminar';
import { filtrarPedidosVisibles } from './utils/pedidosVisibles';
import './styles/global.css';

function mismoId(a, b) {
  return String(a) === String(b);
}

function reemplazarEnLista(lista, actualizado) {
  return lista.map((p) => (mismoId(p.id, actualizado.id) ? { ...p, ...actualizado } : p));
}

export default function App() {
  // —— useState: datos y pantalla ——
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeOk, setMensajeOk] = useState(null);
  const [modalCrear, setModalCrear] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [idGuardandoEstado, setIdGuardandoEstado] = useState(null);
  const [recargar, setRecargar] = useState(0);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  // —— READ: useEffect llama GET al montar o al recargar ——
  useEffect(() => {
    let cancelado = false;

    async function cargarLista() {
      setCargando(true);
      setError(null);
      try {
        const lista = await getPedidos();
        if (!cancelado) {
          setPedidos(filtrarPedidosVisibles(lista));
          setUltimaActualizacion(new Date());
        }
      } catch (err) {
        if (!cancelado) {
          setError(err.message ?? 'No se pudieron cargar los pedidos');
          setPedidos([]);
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargarLista();
    return () => {
      cancelado = true;
    };
  }, [recargar]);

  // Ocultar mensaje de éxito después de 4 segundos
  useEffect(() => {
    if (!mensajeOk) return undefined;
    const timer = setTimeout(() => setMensajeOk(null), 4000);
    return () => clearTimeout(timer);
  }, [mensajeOk]);

  // —— CREATE: POST ——
  async function crearPedido(datos) {
    try {
      const nuevo = await postPedido(datos);
      setPedidos((prev) => filtrarPedidosVisibles([nuevo, ...prev]));
      setMensajeOk('Pedido creado');
      setError(null);
    } catch (err) {
      setError(err.message ?? 'Error al crear');
      throw err;
    }
  }

  // —— UPDATE: PUT (modal) ——
  function alGuardarEdicion(actualizado) {
    setPedidos((prev) => filtrarPedidosVisibles(reemplazarEnLista(prev, actualizado)));
    setMensajeOk(`Pedido #${actualizado.id} actualizado`);
    setIdEditar(null);
    setError(null);
  }

  // —— UPDATE: PATCH estado (tabla) ——
  async function cambiarEstado(pedido, nuevoEstado) {
    if (nuevoEstado === pedido.estado) return;

    const estadoAnterior = pedido.estado;
    setIdGuardandoEstado(pedido.id);
    setPedidos((prev) =>
      prev.map((p) => (mismoId(p.id, pedido.id) ? { ...p, estado: nuevoEstado } : p)),
    );

    try {
      const actualizado = await patchEstadoPedido(pedido.id, nuevoEstado);
      setPedidos((prev) => filtrarPedidosVisibles(reemplazarEnLista(prev, actualizado)));
      setMensajeOk(`Estado: ${nuevoEstado}`);
      setError(null);
    } catch (err) {
      setPedidos((prev) =>
        prev.map((p) => (mismoId(p.id, pedido.id) ? { ...p, estado: estadoAnterior } : p)),
      );
      setError(err.message ?? 'Error al cambiar estado');
    } finally {
      setIdGuardandoEstado(null);
    }
  }

  // —— DELETE: borrado lógico en API (estado → CANCELADO) ——
  async function eliminarPedido(pedido) {
    const confirmado = await confirmarEliminarPedido(pedido);
    if (!confirmado) return;

    const id = String(pedido.id);

    try {
      await deletePedido(id);
      setPedidos((prev) => prev.filter((p) => !mismoId(p.id, id)));
      if (idEditar !== null && mismoId(idEditar, id)) setIdEditar(null);
      setMensajeOk(`Pedido #${id} cancelado`);
      setError(null);
    } catch (err) {
      setError(err.message ?? 'Error al cancelar el pedido');
    }
  }

  const pedidosVisibles = filtrarPedidosVisibles(pedidos);

  return (
    <div className="app-shell">
      <header className="toolbar">
        <div className="toolbar-brand">
          <h1>G14 — Pedidos</h1>
          <span className="toolbar-count">
            {cargando ? '…' : `${pedidosVisibles.length} pedido${pedidosVisibles.length === 1 ? '' : 's'}`}
          </span>
        </div>
        <div className="toolbar-actions">
          <button
            type="button"
            className="btn-icon btn-icon-toolbar"
            onClick={() => setRecargar((n) => n + 1)}
            disabled={cargando}
            title="Recargar"
            aria-label="Recargar"
          >
            <RefreshCw size={18} className={cargando ? 'icon-spin' : ''} />
          </button>
          <button type="button" className="btn btn-primary" onClick={() => setModalCrear(true)}>
            + Nuevo pedido
          </button>
        </div>
      </header>

      {(error || mensajeOk) && (
        <div className="toast-stack" aria-live="polite">
          {error && (
            <div className="toast toast-error" role="alert">
              {error}
              <button type="button" className="toast-dismiss" onClick={() => setError(null)}>×</button>
            </div>
          )}
          {mensajeOk && <div className="toast toast-success">{mensajeOk}</div>}
        </div>
      )}

      <main className="table-panel">
        {ultimaActualizacion && (
          <p className="last-updated">
            Última actualización:{' '}
            <time dateTime={ultimaActualizacion.toISOString()}>
              {formatUltimaActualizacion(ultimaActualizacion)}
            </time>
          </p>
        )}

        <PedidoList
          pedidos={pedidosVisibles}
          cargando={cargando}
          idGuardandoEstado={idGuardandoEstado}
          alEditar={(p) => setIdEditar(p.id)}
          alCambiarEstado={cambiarEstado}
          alEliminar={eliminarPedido}
        />
      </main>

      <Modal open={modalCrear} title="Nuevo pedido" onClose={() => setModalCrear(false)}>
        <PedidoFormCreate
          key={modalCrear ? 'abierto' : 'cerrado'}
          alCrear={crearPedido}
          alExito={() => setModalCrear(false)}
        />
      </Modal>

      <Modal
        open={idEditar !== null}
        title={idEditar ? `Editar pedido #${idEditar}` : 'Editar'}
        onClose={() => setIdEditar(null)}
      >
        {idEditar !== null && (
          <PedidoFormEdit
            key={idEditar}
            pedidoId={idEditar}
            alGuardar={alGuardarEdicion}
            alCancelar={() => setIdEditar(null)}
          />
        )}
      </Modal>
    </div>
  );
}
