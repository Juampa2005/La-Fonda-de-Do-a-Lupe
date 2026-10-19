
import { useEffect, useState } from 'react'
import Menu from './components/Menu'
import Orden from './components/Orden'
import Confirmacion from './components/Confirmacion'
import {
  crearOrden,
  agregarPlatillo,
  quitarPlatillo,
  calcularTotal,
  asignarMesa,
  validarOrden,
  cambiarCantidad,
  MENSAJES,
} from './logic/orden'

import { cargarMenu } from './data/menu'
import { guardarOrden } from './data/ordenes'

export default function App() {
  const [menu, setMenu] = useState([])
  const [orden, setOrden] = useState(crearOrden())
  const [cargando, setCargando] = useState(true)
  const [errorMenu, setErrorMenu] = useState('')
  const [errores, setErrores] = useState([])
  const [errorEnvio, setErrorEnvio] = useState('')
  const [folio, setFolio] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // HU-01 · RNF-04: cargar el menú al montar.
  useEffect(() => {
    let activo = true

    async function obtenerMenu() {
      try {
        const datos = await cargarMenu()

        if (activo) {
          setMenu(datos)
          setErrorMenu('')
        }
      } catch {
        if (activo) {
          setErrorMenu('No se pudo cargar el menú')
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    obtenerMenu()

    return () => {
      activo = false
    }
  }, [])

  // HU-02: agregar y quitar platillos.
  function manejarAgregar(platillo) {
    setOrden((actual) => agregarPlatillo(actual, platillo))
    setErrores([])
    setErrorEnvio('')
    setFolio(null)
  }

  function manejarQuitar(id) {
    setOrden((actual) => quitarPlatillo(actual, id))
    setErrores([])
    setErrorEnvio('')
    setFolio(null)
  }
  function manejarCambiarCantidad(id, cantidad) {
    setOrden((actual) =>
      cambiarCantidad(actual, id, cantidad)
    )
    setErrores([])
    setErrorEnvio('')
    setFolio(null)
  }

  // HU-04: confirmar y guardar la orden.
  async function manejarConfirmar() {
    const resultado = validarOrden(orden)
    setErrores(resultado.errores)

    if (!resultado.valida || enviando) {
      return
    }

    setEnviando(true)
    setErrorEnvio('')
    setFolio(null)

    try {
      const respuesta = await guardarOrden(orden)

      // Solo se limpia después de confirmar el guardado.
      setFolio(respuesta.id)
      setOrden(crearOrden())
      setErrores([])
    } catch {
      setErrorEnvio(
        'No se pudo enviar la orden. Intenta de nuevo.'
      )
    } finally {
      setEnviando(false)
    }
  }

  const total = calcularTotal(orden)
  const mensajesError = errores
    .map((codigo) => MENSAJES[codigo])
    .filter(Boolean)
  return (
    <div className="app">
      <header className="encabezado">
        <h1>La Fonda de Doña Lupe</h1>
        <p>Toma de órdenes</p>
      </header>

      {cargando && <p>Cargando menú…</p>}

      {!cargando && errorMenu && (
        <p role="alert">{errorMenu}</p>
      )}

      <main className="layout">
        {!cargando && !errorMenu && (
          <Menu
            menu={menu}
            onAgregar={manejarAgregar}
          />
        )}


        <Orden
          orden={orden}
          total={total}
          mensajesError={mensajesError}
          errorEnvio={errorEnvio}
          enviando={enviando}
          onQuitar={manejarQuitar}
          onCambiarCantidad={manejarCambiarCantidad}
          onCambiarMesa={(valor) => {
            setOrden((actual) => asignarMesa(actual, valor))
            setErrores([])
            setErrorEnvio('')
            setFolio(null)
          }}
          onConfirmar={manejarConfirmar}
        />

      </main>

      {folio && <Confirmacion folio={folio} />}
    </div>
  )
}
