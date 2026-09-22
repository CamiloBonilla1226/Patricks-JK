import { PREMIOS_RULETA_A, PREMIOS_RULETA_B } from '../data/premiosRuleta'

// Monto mínimo de subtotal para que el cliente sea elegible a girar la
// ruleta de descuentos. Se usa tanto en el carrito (para decidir si se
// consulta si el dispositivo ya jugó) como en el banner de Inicio.
export const RULETA_MIN_SUBTOTAL = 70000

/** Un carrito es elegible a la ruleta si su subtotal alcanza el mínimo. */
export function esElegibleParaRuleta(subtotal) {
  return subtotal >= RULETA_MIN_SUBTOTAL
}

/**
 * Sortea 50/50 cuál de las dos ruletas de 8 premios le toca al cliente.
 * Se llama una vez cada vez que se abre el modal de la ruleta (no antes),
 * para que la elección cambie de una partida a otra.
 */
export function elegirRuletaAleatoria() {
  return Math.random() < 0.5 ? PREMIOS_RULETA_A : PREMIOS_RULETA_B
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

/**
 * Arma el código corto que identifica el premio ganado, para mostrarlo en
 * el mensaje de WhatsApp en vez del texto legible del premio — así, aunque
 * el cliente edite el mensaje antes de enviarlo, no puede hacerse pasar por
 * otro premio sin adivinar un código que además coincida con el día de hoy
 * (quien atiende lo revisa contra una tabla física, fuera de la app).
 *
 * Formato: DD-PJK{codigo}-MM-XX
 *   DD = día de hoy (2 dígitos), MM = mes de hoy (2 dígitos),
 *   XX = 2 dígitos aleatorios, generados una sola vez en el momento del
 *   giro y fijos de ahí en adelante (no se recalculan al armar el mensaje).
 *
 * `codigo` es null para "Perdiste" y "Sigue intentando" (no son premios que
 * deban codificarse) — en ese caso esta función también devuelve null.
 */
export function generarCodigoPremio(codigo, fecha = new Date()) {
  if (!codigo) return null
  const dd = String(fecha.getDate()).padStart(2, '0')
  const mm = String(fecha.getMonth() + 1).padStart(2, '0')
  const xx = String(Math.floor(Math.random() * 100)).padStart(2, '0')
  return `${dd}-PJK${codigo}-${mm}-${xx}`
}
