import CupArt from './CupArt'

const imgStyle = { width: '100%', height: '100%', objectFit: 'contain', display: 'block' }

// Muestra la foto real del producto si existe (`product.imagen`, un archivo
// en public/productos/), o el ícono vectorial de respaldo mientras no la haya.
export default function ProductImage({ product }) {
  if (product.imagen) {
    return <img className="product-image" style={imgStyle} src={product.imagen} alt={product.nombre} loading="lazy" />
  }
  return <CupArt variant={product.art} />
}
