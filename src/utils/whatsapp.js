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
 */
export function buildWhatsAppOrderLink(items, total, comment) {
  const lines = ["🥃 *Nuevo pedido — Patrick's JK*", '']

  items.forEach((item, i) => {
    const qtyLabel = item.cantidad > 1 ? ` x${item.cantidad}` : ''
    const saborLabel = item.sabor ? ` (${item.sabor})` : ''
    lines.push(`${i + 1}. *${item.nombre}${saborLabel}*${qtyLabel}`)
    lines.push(`   ${item.categoria} · ${formatPrice(item.precio * item.cantidad)}`)
    lines.push('')
  })

  lines.push(`*Total: ${formatPrice(total)}*`)

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
