import { useMemo, useState } from 'react'
import { IconCart, IconTrash, IconWhatsapp } from '../components/Icons'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'
import { buildWhatsAppOrderLink } from '../utils/whatsapp'

const COMMENT_MAX_LENGTH = 300

export default function Carrito() {
  const { items, removeItem } = useCart()
  const [comment, setComment] = useState('')

  const total = useMemo(() => items.reduce((sum, item) => sum + item.precio * item.cantidad, 0), [items])
  const whatsappLink = useMemo(() => buildWhatsAppOrderLink(items, total, comment), [items, total, comment])

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
                    onClick={() => removeItem(item.id)}
                    aria-label={`Quitar ${item.nombre} del carrito`}
                  >
                    <IconTrash />
                  </button>
                </div>
                <p>{item.categoria}</p>
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

            <a className="whatsapp-send-btn" href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <IconWhatsapp />
              Enviar pedido por WhatsApp
            </a>
          </>
        )}
      </div>
    </section>
  )
}
