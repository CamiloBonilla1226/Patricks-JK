import CupArt from '../CupArt'
import './ProductCard.css'

function formatPrice(precio) {
  return '$' + precio.toLocaleString('es-CO')
}

export default function ProductCard({ product, onOpen }) {
  const disponible = product.estado === 'disponible'
  return (
    <button className={'card' + (disponible ? '' : ' is-out')} onClick={() => onOpen(product.id)}>
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
  )
}
