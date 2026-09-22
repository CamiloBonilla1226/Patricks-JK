import { useEffect, useMemo, useRef, useState } from 'react'
import { IconCart, IconTrash, IconWhatsapp } from '../components/Icons'
import FeaturedCarousel from '../components/FeaturedCarousel'
import EntregaForm from '../components/EntregaForm'
import RuletaModal from '../components/RuletaModal'
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
  const { items, decrementItem, clearCart, premio } = useCart()
  const { isAvailable } = useDisponibilidad()
  const [comment, setComment] = useState('')
  const [showEntregaForm, setShowEntregaForm] = useState(false)
  const [verificandoRuleta, setVerificandoRuleta] = useState(false)
  const [ruletaDeviceId, setRuletaDeviceId] = useState(null)

  const total = useMemo(() => items.reduce((sum, item) => sum + item.precio * item.cantidad, 0), [items])
  const whatsappLink = useMemo(
    () => buildWhatsAppOrderLink(items, total, comment, premio),
    [items, total, comment, premio],
  )

  // Adelanta la consulta a Supabase apenas el carrito alcanza el mínimo de
  // la ruleta, en vez de esperar a que el cliente haga clic en "Confirmar
  // pedido". Así, para cuando hace clic, la respuesta ya está lista (o casi)
  // y el botón no se queda esperando la red.
  const verificacionRuletaRef = useRef(null) // { deviceId, promise } en curso o ya resuelta
  useEffect(() => {
    if (!esElegibleParaRuleta(total)) {
      verificacionRuletaRef.current = null
      return
    }
    if (verificacionRuletaRef.current) return

    const deviceId = obtenerDeviceId()
    const promise = verificarSiYaJugo(deviceId).catch((err) => {
      // Si falla la consulta, no se bloquea la venta: se trata igual que un
      // dispositivo que no ha jugado.
      console.error('No se pudo verificar si el dispositivo ya jugó la ruleta:', err)
      return false
    })
    verificacionRuletaRef.current = { deviceId, promise }
  }, [total])

  // Si el carrito no alcanza el mínimo, se salta la ruleta y va directo al
  // formulario. Si lo alcanza, se reutiliza la verificación adelantada de
  // arriba (o se lanza una si no alcanzó a dispararse) para decidir si abrir
  // la ruleta o ir directo al formulario.
  async function handleRealizarPedido() {
    if (!esElegibleParaRuleta(total)) {
      setShowEntregaForm(true)
      return
    }

    if (!verificacionRuletaRef.current) {
      const deviceId = obtenerDeviceId()
      const promise = verificarSiYaJugo(deviceId).catch((err) => {
        console.error('No se pudo verificar si el dispositivo ya jugó la ruleta:', err)
        return false
      })
      verificacionRuletaRef.current = { deviceId, promise }
    }
    const { deviceId, promise } = verificacionRuletaRef.current

    setVerificandoRuleta(true)
    const yaJugo = await promise
    setVerificandoRuleta(false)

    if (yaJugo) {
      setShowEntregaForm(true)
    } else {
      setRuletaDeviceId(deviceId)
    }
  }

  function handleRuletaCompletada() {
    // El dispositivo pasó de "no ha jugado" a "ya jugó": la verificación
    // adelantada quedó desactualizada, así que se descarta para que la
    // próxima vez se vuelva a consultar (leerá el caché local al instante).
    verificacionRuletaRef.current = null
    setRuletaDeviceId(null)
    setShowEntregaForm(true)
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
              {verificandoRuleta ? 'Verificando...' : 'Confirmar pedido'}
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

      {ruletaDeviceId && (
        <RuletaModal
          deviceId={ruletaDeviceId}
          onClose={() => setRuletaDeviceId(null)}
          onCompleted={handleRuletaCompletada}
        />
      )}

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
