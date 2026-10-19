
import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

// HU-04
export async function guardarOrden(orden) {
  const documento = await addDoc(collection(db, 'ordenes'), {
    mesa: orden.mesa,
    items: orden.items,
    total: orden.items.reduce(
      (suma, item) => suma + item.precio * item.cantidad,
      0
    ),
    creadoEn: serverTimestamp(),
  })

  return { id: documento.id }
}
