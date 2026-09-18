// Formato de precio compartido por las tarjetas, la ficha de producto, el
// carrito y el mensaje de WhatsApp, para no repetir el mismo cálculo en
// cada lugar que muestra un precio.
export function formatPrice(precio) {
  return '$' + precio.toLocaleString('es-CO')
}
