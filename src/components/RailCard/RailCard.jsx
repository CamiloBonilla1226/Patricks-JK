import CupArt from '../CupArt'
import { formatPrice } from '../../utils/format'
import './RailCard.css'

export default function RailCard({ product, onOpen }) {
  return (
    <button className="rail-card" onClick={() => onOpen(product.id)}>
      <div className="cupwrap">
        <CupArt variant={product.art} />
      </div>
      <h3>{product.nombre}</h3>
      <div className="price">{formatPrice(product.precio)}</div>
    </button>
  )
}
