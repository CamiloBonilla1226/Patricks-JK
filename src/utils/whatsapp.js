import { formatPrice } from './format'

// Número de WhatsApp del negocio (Colombia, +57) — se usa tanto para el
// contacto de "Nosotros" como para enviar el pedido desde el carrito.
export const WHATSAPP_NUMBER = '3146032055'
const WHATSAPP_COUNTRY_CODE = '57'

/** Link para abrir un chat directo con el negocio, sin mensaje precargado. */
export function buildWhatsAppContactLink() {
  return `https://wa.me/${WHATSAPP_COUNTRY_CODE}${WHATSAPP_NUMBER}`
}

/**
 * Arma el mensaje del pedido (cada producto con su tamaño, adiciones y
 * precio ya con la promo aplicada, el total y el comentario si hay) y
 * devuelve el link de WhatsApp con ese texto precargado — el cliente solo
 * tiene que revisarlo y darle enviar, nunca se manda nada sin que él lo vea.
 *
 * @param {{codigoGenerado: string|null}|null} [premio] - Premio ganado en la
 * ruleta, si aplica. El mensaje NUNCA muestra el texto legible del premio
 * (ej. "5% en el total de la cuenta") — solo su código corto
 * (`codigoGenerado`, ver generarCodigoPremio en utils/ruleta.js). Esto es
 * deliberado: el cliente puede editar este mensaje libremente en su
 * teléfono antes de enviarlo, así que el texto del premio nunca debe viajar
 * ahí en claro, o podría cambiarlo por otro premio antes de enviarlo. El
 * total del pedido tampoco cambia aquí (el negocio aplica el descuento
 * manualmente al confirmar, revisando el código contra una tabla física).
 */
export function buildWhatsAppOrderLink(items, total, comment, premio) {
  const lines = ["🥃 *Nuevo pedido — Patrick's JK*", '']

  items.forEach((item, i) => {
    const qtyLabel = item.cantidad > 1 ? ` x${item.cantidad}` : ''
    const saborLabel = item.sabor ? ` (${item.sabor})` : ''
    lines.push(`${i + 1}. *${item.nombre}${saborLabel}*${qtyLabel}`)
    lines.push(`   ${item.categoria} · ${formatPrice(item.precio * item.cantidad)}`)
    lines.push('')
  })

  lines.push(`*Total: ${formatPrice(total)}*`)

  if (premio?.codigoGenerado) {
    lines.push('')
    lines.push(`🎡 Premio de la ruleta: ${premio.codigoGenerado}`)
  }

  const trimmedComment = comment.trim()
  if (trimmedComment) {
    lines.push('')
    lines.push(`📝 *Comentario:* ${trimmedComment}`)
  }

  lines.push('')
  lines.push("_Pedido generado desde la carta digital de Patrick's JK_")

  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${WHATSAPP_COUNTRY_CODE}${WHATSAPP_NUMBER}?text=${text}`
}
