/**
 * UPDATE — GET por id + formulario controlado + PUT a la API
 * Hooks: useState + useEffect (cargar pedido al abrir el modal)
 */
import { useEffect, useState } from 'react';
import { getPedidoPorId, putPedido } from '../services/api';
import { estadoClass } from '../constants/estados';
import PedidoCampos from './PedidoCampos';
import { formatMonto } from '../utils/formatMonto';
import {
  formularioAApi,
  pedidoAFormulario,
  validarFormulario,
} from '../utils/validacionPedido';

export default function PedidoFormEdit({ pedidoId, alGuardar, alCancelar }) {
  const [values, setValues] = useState(null);
  const [info, setInfo] = useState(null);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // useEffect: pedir el pedido a la API cuando cambia el id
  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const pedido = await getPedidoPorId(pedidoId);
        if (!cancelado) {
          setValues(pedidoAFormulario(pedido));
          setInfo({
            estado: pedido.estado,
            total: pedido.total,
            fechaPedido: pedido.fechaPedido,
          });
        }
      } catch (err) {
        if (!cancelado) setError(err.message ?? 'No se pudo cargar el pedido');
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, [pedidoId]);

  function onChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: undefined }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const erroresValidacion = validarFormulario(values);
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    setEnviando(true);
    setError(null);
    try {
      const actualizado = await putPedido(pedidoId, formularioAApi(values));
      alGuardar?.(actualizado);
    } catch (err) {
      setError(err.message ?? 'Error al actualizar');
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) {
    return (
      <div className="modal-loading">
        <div className="spinner" aria-hidden="true" />
        <p>Cargando pedido…</p>
      </div>
    );
  }

  if (error && !values) {
    return (
      <div className="modal-error">
        <p>{error}</p>
        <button type="button" className="btn btn-secondary" onClick={alCancelar}>
          Cerrar
        </button>
      </div>
    );
  }

  if (!values || !info) return null;

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="pedido-meta-bar">
        <span className={estadoClass(info.estado)}>{info.estado}</span>
        <span className="pedido-meta-total">{formatMonto(info.total)}</span>
      </div>

      <PedidoCampos
        values={values}
        errores={errores}
        onChange={onChange}
        deshabilitado={enviando}
        mostrarProductoId={false}
      />

      {error && <p className="field-error block">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={alCancelar} disabled={enviando}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}
