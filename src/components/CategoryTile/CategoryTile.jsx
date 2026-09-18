import { IconBottle } from '../Icons'
import './CategoryTile.css'

export default function CategoryTile({ category, count, onOpen }) {
  return (
    <button className="cat-tile" onClick={() => onOpen(category)}>
      <IconBottle />
      <span>
        <b>{category}</b>
        <span>{count} producto{count === 1 ? '' : 's'}</span>
      </span>
    </button>
  )
}
