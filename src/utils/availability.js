/**
 * Combina el `estado` estático de un producto (products.js) con el valor
 * real que resuelve la hoja de disponibilidad, para que las tarjetas
 * muestren siempre el estado vigente en vez del que quedó escrito en el
 * código.
 */
export function resolveProductAvailability(product, isAvailable) {
  const staticAvailable = product.estado === 'disponible'
  const available = isAvailable(product.id, staticAvailable)
  if (available === staticAvailable) return product
  return { ...product, estado: available ? 'disponible' : 'agotado' }
}
