import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import { IconSearch } from '../components/Icons'
import { CATEGORIES, PRODUCTS } from '../data/products'
import { useDisponibilidad } from '../context/DisponibilidadContext'
import { resolveProductAvailability } from '../utils/availability'
import { matchesQuery } from '../utils/search'

const SEARCH_MAX_LENGTH = 60

export default function Menu({ activeCategory, onChangeCategory, onOpenProduct }) {
  const category = CATEGORIES.includes(activeCategory) ? activeCategory : CATEGORIES[0]
  const { isAvailable } = useDisponibilidad()
  const [query, setQuery] = useState('')
  const searching = query.trim().length > 0

  // Buscando, se ignoran las categorías y se busca en todo el menú — el
  // cliente puede no acordarse en qué categoría está lo que quiere.
  const productsToShow = searching ? PRODUCTS : PRODUCTS.filter((p) => p.categoria === category)
  const visibleProducts = productsToShow
    .map((product) => resolveProductAvailability(product, isAvailable))
    .filter((product) => product.estado === 'disponible')
    .filter((product) => matchesQuery(product, query))

  function selectCategory(key) {
    setQuery('')
    onChangeCategory(key)
  }

  return (
    <section className="screen" id="tab-menu">
      <div className="sec-head">
        <div className="eyebrow">Carta</div>
        <h1>Menú</h1>
      </div>

      <div className="search-box" data-no-swipe>
        <IconSearch />
        <input
          type="search"
          className="search-input"
          placeholder="Buscar un producto..."
          aria-label="Buscar un producto"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={SEARCH_MAX_LENGTH}
        />
      </div>

      <div className="subtabs">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={!searching && c === activeCategory ? 'active' : ''}
            onClick={() => selectCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="catpanel" id={'cat-' + category}>
        <div className="cat-count">
          {searching
            ? `${visibleProducts.length} resultado${visibleProducts.length === 1 ? '' : 's'}`
            : `${visibleProducts.length} producto${visibleProducts.length === 1 ? '' : 's'}`}
        </div>

        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} onOpen={onOpenProduct} />
        ))}

        {visibleProducts.length === 0 && (
          <p className="menu-empty">
            {searching
              ? <>No encontramos ningún producto con &quot;{query.trim()}&quot;.</>
              : <>Por ahora no hay productos disponibles en {category.toLowerCase()}.</>}
          </p>
        )}
      </div>
    </section>
  )
}
