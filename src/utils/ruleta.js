// Monto mínimo de subtotal para que el cliente sea elegible a girar la
// ruleta de descuentos. Se usa tanto en el carrito (para decidir si se
// consulta si el dispositivo ya jugó) como en el banner de Inicio.
export const RULETA_MIN_SUBTOTAL = 70000

/** Un carrito es elegible a la ruleta si su subtotal alcanza el mínimo. */
export function esElegibleParaRuleta(subtotal) {
  return subtotal >= RULETA_MIN_SUBTOTAL
}

// Texto exacto (ver src/data/premiosRuleta.js) que hace que un giro no
// cuente como jugado: el dispositivo puede volver a girar sin registrarse.
export const SIGUE_INTENTANDO = 'Sigue intentando'

/**
 * La tabla dispositivos_ruleta exige un porcentaje numérico (no nulo) por
 * cada giro, pero los premios son texto libre y no todos son un porcentaje
 * de descuento (ver premiosRuleta.js). Se extrae el número solo cuando el
 * texto del premio lo menciona explícitamente (ej. "10% en el total de la
 * cuenta"); para cualquier otro premio se guarda 0 — la Parte 3, que aplica
 * el descuento al total, es la que decide qué hacer con cada premio.
 */
export function extraerPorcentaje(texto) {
  const match = texto.match(/(\d+(?:\.\d+)?)\s*%/)
  return match ? Number(match[1]) : 0
}
