
export default function Orden({
  orden,
  total,
  mensajesError = [],
  errorEnvio = '',
  enviando = false,
  onQuitar,
  onCambiarCantidad,
  onCambiarMesa,
  onConfirmar,
}) {
  return (
    <section aria-label="Orden">
      <h2>Orden</h2>

      <div>
        <label htmlFor="mesa">
          Número de mesa (1 al 20)
        </label>
        <input
          id="mesa"
          name="mesa"
          type="number"
          min="1"
          max="20"
          step="1"
          value={orden.mesa ?? ''}
          onChange={(evento) =>
            onCambiarMesa?.(evento.target.value)
          }
        />
      </div>

      {mensajesError.length > 0 && (
        <div role="alert">
          {mensajesError.map((mensaje) => (
            <p key={mensaje}>{mensaje}</p>
          ))}
        </div>
      )}

      {errorEnvio && (
        <p role="alert">{errorEnvio}</p>
      )}

      {orden.items.length === 0 ? (
        <p>La orden está vacía.</p>
      ) : (
        <ul>
          {orden.items.map((item) => (
            <li key={item.id}>
              <h3>{item.nombre}</h3>

              <p>
                Precio unitario: $
                {Number(item.precio).toFixed(2)}
              </p>

              <p>Cantidad: {item.cantidad}</p>

              <p>
                Subtotal: $
                {(item.precio * item.cantidad).toFixed(2)}
              </p>

              <div>
                <button
                  type="button"
                  aria-label={`Disminuir cantidad de ${item.nombre}`}
                  onClick={() =>
                    onCambiarCantidad?.(
                      item.id,
                      item.cantidad - 1
                    )
                  }
                >
                  Menos
                </button>

                <button
                  type="button"
                  aria-label={`Aumentar cantidad de ${item.nombre}`}
                  disabled={item.cantidad >= 10}
                  onClick={() =>
                    onCambiarCantidad?.(
                      item.id,
                      item.cantidad + 1
                    )
                  }
                >
                  Más
                </button>

                <button
                  type="button"
                  onClick={() => onQuitar?.(item.id)}
                >
                  Quitar {item.nombre}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p>
        <strong>
          Total: ${Number(total).toFixed(2)}
        </strong>
      </p>

      <button
        type="button"
        onClick={onConfirmar}
        disabled={enviando}
      >
        {enviando
          ? 'Enviando orden…'
          : 'Confirmar orden'}
      </button>
    </section>
  )
}
