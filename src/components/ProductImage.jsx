import CupArt from './CupArt'

// "cover" (en vez de "contain") para que la foto llene siempre el recuadro
// de la tarjeta, sin dejar franjas vacías cuando la caja no es cuadrada
// (como el carrusel, que es más ancho que alto) — para eso pedimos fotos
// cuadradas con el producto centrado, así el recorte nunca corta el producto.
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }

// Muestra la foto real del producto si existe (`product.imagen`, un archivo
// en public/productos/), o el ícono vectorial de respaldo mientras no la haya.
export default function ProductImage({ product }) {
  if (product.imagen) {
    return <img className="product-image" style={imgStyle} src={product.imagen} alt={product.nombre} loading="lazy" />
  }
  return <CupArt variant={product.art} />
}
