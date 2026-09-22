// Monto mínimo de subtotal para que el cliente sea elegible a girar la
// ruleta de descuentos. Se usa tanto en el carrito (para decidir si se
// consulta si el dispositivo ya jugó) como en el banner de Inicio.
export const RULETA_MIN_SUBTOTAL = 70000

/** Un carrito es elegible a la ruleta si su subtotal alcanza el mínimo. */
export function esElegibleParaRuleta(subtotal) {
  return subtotal >= RULETA_MIN_SUBTOTAL
}
