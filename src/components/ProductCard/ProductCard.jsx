import { useState } from 'react'
import CupArt from '../CupArt'
import { IconPlus, IconCheck } from '../Icons'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/format'
import './ProductCard.css'

const QUICK_ADD_FEEDBACK_MS = 500

export default function ProductCard({ product, onOpen }) {
  const { addItem } = useCart()
  const disponible = product.estado === 'disponible'
  const [added, setAdded] = useState(false)

  function handleQuickAdd(e) {
    e.stopPropagation()
    if (!disponible) return
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
    <div className={'card' + (disponible ? '' : ' is-out')}>
      <button className="card-main" onClick={() => onOpen(product.id)} disabled={!disponible}>
        <div className="cupwrap">
          <CupArt variant={product.art} />
        </div>
        <div className="card-body">
          <div className="card-top">
            <h3>{product.nombre}</h3>
            <div className="price">{formatPrice(product.precio)}</div>
          </div>
          <p className="contains">{product.categoria}</p>
          <span className={'status' + (disponible ? ' ok' : '')}>
            <span className="dot"></span>
            {disponible ? 'Disponible' : 'Agotado'}
          </span>
        </div>
        <div className="tapcue">›</div>
      </button>
      <button
        type="button"
        className={'quick-add' + (added ? ' is-added' : '')}
        onClick={handleQuickAdd}
        disabled={!disponible}
        aria-disabled={!disponible}
        aria-label={`Agregar ${product.nombre} al carrito`}
      >
        {added ? <IconCheck /> : <IconPlus />}
      </button>
    </div>
  )
}
