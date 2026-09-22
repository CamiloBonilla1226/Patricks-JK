import { useMemo, useState } from 'react'
import { IconCart, IconTrash, IconWhatsapp } from '../components/Icons'
import FeaturedCarousel from '../components/FeaturedCarousel'
import EntregaForm from '../components/EntregaForm'
import { useCart } from '../context/CartContext'
import { useDisponibilidad } from '../context/DisponibilidadContext'
import { resolveProductAvailability } from '../utils/availability'
import { esElegibleParaRuleta } from '../utils/ruleta'
import { PRODUCTS } from '../data/products'
import { formatPrice } from '../utils/format'
import { buildWhatsAppOrderLink } from '../utils/whatsapp'
import { obtenerDeviceId } from '../lib/deviceId'
import { verificarSiYaJugo } from '../lib/ruleta'

const COMMENT_MAX_LENGTH = 300
const SUGGESTIONS_MAX_PRICE = 20000
const SUGGESTIONS_COUNT = 5

// Baraja tipo Fisher-Yates, para mostrar una selección al azar de productos
// económicos cada vez que se entra al carrito.
function shuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function Carrito({ onOpenProduct, onGoToInicio }) {
  const { items, decrementItem, clearCart } = useCart()
  const { isAvailable } = useDisponibilidad()
  const [comment, setComment] = useState('')
  const [showEntregaForm, setShowEntregaForm] = useState(false)
  const [verificandoRuleta, setVerificandoRuleta] = useState(false)

  const total = useMemo(() => items.reduce((sum, item) => sum + item.precio * item.cantidad, 0), [items])
  const whatsappLink = useMemo(() => buildWhatsAppOrderLink(items, total, comment), [items, total, comment])

  // Si el carrito no alcanza el mínimo, se salta la ruleta y va directo al
  // formulario. Si lo alcanza, se consulta si el dispositivo ya jugó antes
  // de decidir si abrir la ruleta o el formulario directamente.
  async function handleRealizarPedido() {
    if (!esElegibleParaRuleta(total)) {
      setShowEntregaForm(true)
      return
    }

    setVerificandoRuleta(true)
    let yaJugo
    try {
      const deviceId = obtenerDeviceId()
      yaJugo = await verificarSiYaJugo(deviceId)
    } catch (err) {
      // Si falla la consulta, no se bloquea la venta: se trata igual que un
      // dispositivo que no ha jugado.
      console.error('No se pudo verificar si el dispositivo ya jugó la ruleta:', err)
      yaJugo = false
    }
    setVerificandoRuleta(false)

    if (yaJugo) {
      setShowEntregaForm(true)
    } else {
      // TODO: abrir la ruleta aquí cuando exista su interfaz (tarea aparte).
      console.log('Aquí se debe abrir la ruleta')
    }
  }

  function handlePedidoFinalizado() {
    setShowEntregaForm(false)
    clearCart()
    setComment('')
    onGoToInicio()
  }

  // Se calcula una sola vez al entrar al carrito, para que la selección no
  // cambie mientras el cliente escribe un comentario o agrega productos.
  const [suggestedProducts] = useState(() => {
    const available = PRODUCTS.map((product) => resolveProductAvailability(product, isAvailable)).filter(
      (product) => product.estado === 'disponible' && product.precio < SUGGESTIONS_MAX_PRICE,
    )
    return shuffle(available).slice(0, SUGGESTIONS_COUNT)
  })
  const cartProductIds = useMemo(() => new Set(items.map((item) => item.productId)), [items])
  const suggestionsToShow = suggestedProducts.filter((product) => !cartProductIds.has(product.id))

  return (
    <section className="screen" id="tab-carrito">
      <div className="sec-head">
        <div className="eyebrow">Tu pedido</div>
        <h1>Carrito</h1>
      </div>
      <div id="cartContent">
        {items.length === 0 ? (
          <div className="cart-empty">
            <IconCart className="ico" strokeWidth="1.6" />
            <p>
              Tu carrito está vacío.
              <br />
              Ve al menú y elige algo rico.
            </p>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="row1">
                  <h3>{item.nombre}</h3>
                  {item.cantidad > 1 && <span className="cart-item-qty">x{item.cantidad}</span>}
                  <div className="price">{formatPrice(item.precio * item.cantidad)}</div>
                  <button
                    type="button"
                    className="cart-item-remove"
                    onClick={() => decrementItem(item.id)}
                    aria-label={`Quitar ${item.nombre} del carrito`}
                  >
                    <IconTrash />
                  </button>
                </div>
                <p>{item.sabor ? `${item.categoria} · ${item.sabor}` : item.categoria}</p>
              </div>
            ))}
            <div className="cart-total">
              <span>Total del pedido</span>
              <b>{formatPrice(total)}</b>
            </div>

            <div className="cart-comment-group">
              <label htmlFor="cart-comment" className="cart-comment-label">
                Comentario (opcional)
              </label>
              <textarea
                id="cart-comment"
                className="cart-comment"
                placeholder="Ej: sin pitillo, para recoger a las 7pm..."
                maxLength={COMMENT_MAX_LENGTH}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="whatsapp-send-btn"
              onClick={handleRealizarPedido}
              disabled={verificandoRuleta}
            >
              <IconWhatsapp />
              {verificandoRuleta ? 'Verificando...' : 'Realizar pedido'}
            </button>
          </>
        )}

        {items.length > 0 && suggestionsToShow.length > 0 && (
          <>
            <div className="block-title">
              <h2>¿Quieres agregar algo más?</h2>
            </div>
            <FeaturedCarousel products={suggestionsToShow} onOpen={onOpenProduct} showQuickAdd />
          </>
        )}
      </div>

      {showEntregaForm && (
        <EntregaForm
          subtotal={total}
          whatsappLink={whatsappLink}
          onClose={() => setShowEntregaForm(false)}
          onFinish={handlePedidoFinalizado}
        />
      )}
    </section>
  )
}
