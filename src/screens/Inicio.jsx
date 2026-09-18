import FeaturedCarousel from '../components/FeaturedCarousel'
import CategoryTile from '../components/CategoryTile'
import StoreInfo from '../components/StoreInfo'
import { PRODUCTS, CATEGORIES } from '../data/products'
import { useDisponibilidad } from '../context/DisponibilidadContext'
import { resolveProductAvailability } from '../utils/availability'

const FEATURED_COUNT = 5

export default function Inicio({ onOpenProduct, onGoToCategory }) {
  const { isAvailable } = useDisponibilidad()
  const featuredProducts = PRODUCTS.map((product) => resolveProductAvailability(product, isAvailable))
    .filter((product) => product.estado === 'disponible')
    .slice(0, FEATURED_COUNT)

  return (
    <section className="screen" id="tab-inicio">
      <div className="hero-logo">
        <span className="hero-logo-text">Patrick's JK</span>
      </div>

      <div className="sec-head">
        <div className="eyebrow">Carta digital</div>
        <h1>¿Qué te vas a tomar hoy?</h1>
      </div>

      {featuredProducts.length > 0 && (
        <>
          <div className="block-title">
            <h2>Más pedidos</h2>
          </div>
          <FeaturedCarousel products={featuredProducts} onOpen={onOpenProduct} />
        </>
      )}

      <div className="block-title">
        <h2>Categorías</h2>
      </div>
      <div className="cat-grid">
        {CATEGORIES.map((c) => (
          <CategoryTile
            key={c}
            category={c}
            count={PRODUCTS.filter((p) => p.categoria === c).length}
            onOpen={onGoToCategory}
          />
        ))}
      </div>

      <div className="block-title">
        <h2>Nosotros</h2>
      </div>
      <StoreInfo />
    </section>
  )
}
