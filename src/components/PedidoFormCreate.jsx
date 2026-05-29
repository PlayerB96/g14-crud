/**
 * CREATE — Formulario controlado + validación + POST a la API
 * Hooks: useState (values, errores, enviando)
 */
import { useState } from 'react';
import PedidoCampos from './PedidoCampos';
import {
  FORMULARIO_VACIO,
  formularioAApi,
  validarFormulario,
} from '../utils/validacionPedido';

export default function PedidoFormCreate({ alCrear, alExito }) {
  const [values, setValues] = useState({ ...FORMULARIO_VACIO });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

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
    try {
      await alCrear(formularioAApi(values));
      setValues({ ...FORMULARIO_VACIO });
      setErrores({});
      alExito?.();
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <PedidoCampos
        values={values}
        errores={errores}
        onChange={onChange}
        deshabilitado={enviando}
        conPlaceholders
      />
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Crear pedido'}
        </button>
      </div>
    </form>
  );
}
