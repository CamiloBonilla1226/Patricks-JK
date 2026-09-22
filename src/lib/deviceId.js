const DEVICE_ID_KEY = 'device_id'

// Identificador de dispositivo para el control de "un giro por dispositivo"
// en la ruleta. Es un control de abuso liviano guardado en localStorage, no
// un mecanismo de autenticación: se genera una sola vez por navegador y se
// reutiliza mientras no se borre el localStorage.
export function obtenerDeviceId() {
  const existente = localStorage.getItem(DEVICE_ID_KEY)
  if (existente) return existente

  const nuevo = crypto.randomUUID()
  localStorage.setItem(DEVICE_ID_KEY, nuevo)
  return nuevo
}
