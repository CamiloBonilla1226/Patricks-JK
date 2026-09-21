import { IconBottle, IconBeerMug, IconCocktail, IconSnack } from '../Icons'
import './CategoryTile.css'

// Un ícono distinto por categoría para que la grilla de Inicio no se vea
// repetitiva. Las categorías que no están mapeadas aquí caen en IconBottle.
const CATEGORY_ICONS = {
  Cervezas: IconBeerMug,
  Aperitivos: IconCocktail,
  Mecato: IconSnack,
  Alcohol: IconBottle,
}

export default function CategoryTile({ category, count, onOpen }) {
  const Icon = CATEGORY_ICONS[category] || IconBottle
  return (
    <button className="cat-tile" onClick={() => onOpen(category)}>
      <Icon />
      <span>
        <b>{category}</b>
        <span>{count} producto{count === 1 ? '' : 's'}</span>
      </span>
    </button>
  )
}
