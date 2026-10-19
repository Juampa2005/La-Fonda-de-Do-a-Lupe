
export const MAX_POR_PLATILLO = 10
export const MESA_MIN = 1
export const MESA_MAX = 20

export const MENSAJES = {
  MESA_INVALIDA: 'Selecciona una mesa del 1 al 20',
  ORDEN_VACIA: 'Agrega al menos un platillo',
}

// Crear una orden vacía
export function crearOrden() {
  return { mesa: null, items: [] }
}

// HU-02-E3: quitar un platillo
export function quitarPlatillo(orden, id) {
  return {
    ...orden,
    items: orden.items.filter((item) => item.id !== id),
  }
}

// HU-02-E1, HU-02-E2, HU-05 y HU-06
export function agregarPlatillo(orden, platillo) {
  // HU-06: un platillo agotado no se agrega
  if (platillo.disponible === false) {
    return orden
  }

  const existente = orden.items.find(
    (item) => item.id === platillo.id
  )

  // HU-05: no superar el máximo de 10
  if (existente && existente.cantidad >= MAX_POR_PLATILLO) {
    return orden
  }

  if (existente) {
    return {
      ...orden,
      items: orden.items.map((item) =>
        item.id === platillo.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ),
    }
  }

  return {
    ...orden,
    items: [
      ...orden.items,
      {
        id: platillo.id,
        nombre: platillo.nombre,
        precio: platillo.precio,
        cantidad: 1,
        nota: '',
      },
    ],
  }
}

// HU-03: calcular el total sin agregar IVA
export function calcularTotal(orden) {
  return orden.items.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  )
}

// HU-04-E2: asignar mesa
export function asignarMesa(orden, valor) {
  const texto = String(valor).trim()
  const numero = texto === '' ? NaN : Number(texto)

  return {
    ...orden,
    mesa: Number.isFinite(numero) ? numero : null,
  }
}

// HU-04-E2 y HU-04-E3: validar la orden
export function validarOrden(orden) {
  const errores = []

  if (
    !Number.isInteger(orden.mesa) ||
    orden.mesa < MESA_MIN ||
    orden.mesa > MESA_MAX
  ) {
    errores.push('MESA_INVALIDA')
  }

  if (orden.items.length === 0) {
    errores.push('ORDEN_VACIA')
  }

  return {
    valida: errores.length === 0,
    errores,
  }
}

// HU-05: cambiar la cantidad
export function cambiarCantidad(orden, id, cantidad) {

  const numero = Number(cantidad)


  if (!Number.isFinite(numero)) {
    return orden
  }

  if (numero <= 0) {
    return quitarPlatillo(orden, id)
  }

  const cantidadFinal = Math.min(
    Math.floor(numero),
    MAX_POR_PLATILLO
  )

  return {
    ...orden,
    items: orden.items.map((item) =>
      item.id === id
        ? { ...item, cantidad: cantidadFinal }
        : item
    ),
  }
}

// HU-08: poner una nota en un platillo
export function ponerNota(orden, id, nota) {
  return {
    ...orden,
    items: orden.items.map((item) =>
      item.id === id
        ? { ...item, nota: String(nota) }
        : item
    ),
  }
}
