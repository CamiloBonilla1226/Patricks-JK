import { useState } from 'react'
import ProductImage from '../ProductImage'
import { IconPlus, IconCheck } from '../Icons'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/format'
import './RailCard.css'

const QUICK_ADD_FEEDBACK_MS = 500

export default function RailCard({ product, onOpen, showQuickAdd = false }) {
  const { addItem } = useCart()
  const disponible = product.estado === 'disponible'
  const [added, setAdded] = useState(false)

  function handleQuickAdd(e) {
    e.stopPropagation()
    if (!disponible) return
    // Si el producto tiene sabores para elegir, el "+" rápido no puede
    // agregarlo directo: se abre la ficha para que el cliente elija primero.
    if (product.sabores?.length) {
      onOpen(product.id)
      return
    }
    addItem({
      productId: product.id,
      nombre: product.nombre,
      categoria: product.categoria,
      precio: product.precio,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), QUICK_ADD_FEEDBACK_MS)
  }

  return (
    <div className="rail-card-wrap">
      <button className="rail-card" onClick={() => onOpen(product.id)}>
        <div className="cupwrap">
          <ProductImage product={product} />
        </div>
        <h3>{product.nombre}</h3>
        <div className="price">{formatPrice(product.precio)}</div>
      </button>
      {showQuickAdd && (
        <button
          type="button"
          className={'rail-quick-add' + (added ? ' is-added' : '')}
          onClick={handleQuickAdd}
          disabled={!disponible}
          aria-disabled={!disponible}
          aria-label={`Agregar ${product.nombre} al carrito`}
        >
          {added ? <IconCheck /> : <IconPlus />}
        </button>
      )}
    </div>
  )
}
