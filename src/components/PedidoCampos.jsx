/**
 * Campos del formulario controlado (value + onChange en cada input)
 * Reutilizado en CREATE y UPDATE
 */
export default function PedidoCampos({
  values,
  errores,
  onChange,
  deshabilitado,
  conPlaceholders,
  mostrarProductoId = true,
}) {
  return (
    <div className="form-grid">
      <label>
        Cliente
        <input
          name="cliente"
          value={values.cliente}
          onChange={onChange}
          placeholder={conPlaceholders ? 'Bryan Pérez' : undefined}
          disabled={deshabilitado}
        />
        {errores.cliente && <span className="field-error">{errores.cliente}</span>}
      </label>

      <label>
        Correo del cliente
        <input
          name="correoCliente"
          type="email"
          value={values.correoCliente}
          onChange={onChange}
          placeholder={conPlaceholders ? 'juan@email.com' : undefined}
          disabled={deshabilitado}
        />
        {errores.correoCliente && (
          <span className="field-error">{errores.correoCliente}</span>
        )}
      </label>

      {mostrarProductoId && (
        <label>
          ID producto
          <input
            name="productoId"
            type="number"
            min="1"
            value={values.productoId}
            onChange={onChange}
            placeholder={conPlaceholders ? '1' : undefined}
            disabled={deshabilitado}
          />
          {errores.productoId && <span className="field-error">{errores.productoId}</span>}
        </label>
      )}

      <label>
        Nombre del producto
        <input
          name="nombreProducto"
          value={values.nombreProducto}
          onChange={onChange}
          placeholder={conPlaceholders ? 'Laptop Lenovo' : undefined}
          disabled={deshabilitado}
        />
        {errores.nombreProducto && (
          <span className="field-error">{errores.nombreProducto}</span>
        )}
      </label>

      <label>
        Cantidad
        <input
          name="cantidad"
          type="number"
          min="1"
          value={values.cantidad}
          onChange={onChange}
          placeholder={conPlaceholders ? '2' : undefined}
          disabled={deshabilitado}
        />
        {errores.cantidad && <span className="field-error">{errores.cantidad}</span>}
      </label>

      <label>
        Precio unitario
        <input
          name="precioUnitario"
          type="number"
          min="0.01"
          step="0.01"
          value={values.precioUnitario}
          onChange={onChange}
          placeholder={conPlaceholders ? '3200.00' : undefined}
          disabled={deshabilitado}
        />
        {errores.precioUnitario && (
          <span className="field-error">{errores.precioUnitario}</span>
        )}
      </label>
    </div>
  );
}
