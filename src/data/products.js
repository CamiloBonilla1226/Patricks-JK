// Datos de ejemplo — reemplazar por Supabase cuando exista el backend

/**
 * @typedef {Object} Producto
 * @property {string} id
 * @property {string} nombre
 * @property {number} precio
 * @property {string} categoria
 * @property {'disponible'|'agotado'} estado
 * @property {string[]} [sabores] - Si existe, el cliente debe elegir uno antes de agregar al carrito.
 * @property {string} [imagen] - Ruta pública de la foto (public/productos/<id>.ext). Si no existe, se usa el ícono de respaldo.
 */

/** @type {Producto[]} */
export const PRODUCTS = [
  // Cervezas — six packs
  { id: 'cerveza-sixpack-poker', nombre: 'Six Pack Poker', precio: 30000, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerveza-sixpack-aguila-light', nombre: 'Six Pack Águila Light', precio: 30000, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerveza-sixpack-aguila-original', nombre: 'Six Pack Águila Original', precio: 30000, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerveza-sixpack-budweiser', nombre: 'Six Pack Budweiser', precio: 30000, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerveza-sixpack-heineken', nombre: 'Six Pack Heineken', precio: 30000, categoria: 'Cervezas', estado: 'disponible' },

  // Cervezas — unidad
  { id: 'cerveza-poker', nombre: 'Poker', precio: 5000, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerveza-corona', nombre: 'Corona', precio: 8000, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerveza-coronita', nombre: 'Coronita', precio: 5000, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerveza-aguila-light', nombre: 'Águila Light', precio: 5000, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerveza-aguila-original', nombre: 'Águila Original', precio: 5000, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerveza-club-colombia-dorada', nombre: 'Club Colombia Dorada', precio: 5000, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerveza-costenita', nombre: 'Costeñita', precio: 4000, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerveza-heineken', nombre: 'Heineken', precio: 5000, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerveza-budweiser', nombre: 'Budweiser', precio: 5000, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerveza-tecate', nombre: 'Tecate', precio: 4000, categoria: 'Cervezas', estado: 'disponible' },

  // Aperitivos
  { id: 'aperitivo-cuates-rojo', nombre: 'Cuates Rojo', precio: 6000, categoria: 'Aperitivos', estado: 'disponible' },
  { id: 'aperitivo-cuates-amarillo', nombre: 'Cuates Amarillo', precio: 6000, categoria: 'Aperitivos', estado: 'disponible' },
  { id: 'aperitivo-cuates-verde', nombre: 'Cuates Verde', precio: 6000, categoria: 'Aperitivos', estado: 'disponible' },
  { id: 'aperitivo-smirnoff-manzana-verde', nombre: 'Smirnoff Manzana Verde', precio: 10000, categoria: 'Aperitivos', estado: 'disponible' },
  { id: 'aperitivo-smirnoff-original', nombre: 'Smirnoff Original', precio: 10000, categoria: 'Aperitivos', estado: 'disponible' },
  { id: 'aperitivo-redds-rose', nombre: "Redd's Rose", precio: 5000, categoria: 'Aperitivos', estado: 'disponible' },
  { id: 'aperitivo-redds-verde', nombre: "Redd's Verde", precio: 5000, categoria: 'Aperitivos', estado: 'disponible' },
  { id: 'aperitivo-like-blueberry', nombre: 'Like Blueberry', precio: 5000, categoria: 'Aperitivos', estado: 'disponible' },
  { id: 'aperitivo-like-citrus', nombre: 'Like Citrus', precio: 5000, categoria: 'Aperitivos', estado: 'disponible' },
  { id: 'aperitivo-like-mango', nombre: 'Like Mango', precio: 5000, categoria: 'Aperitivos', estado: 'disponible' },
  { id: 'aperitivo-like-fresh-apple', nombre: 'Like Fresh Apple', precio: 5000, categoria: 'Aperitivos', estado: 'disponible' },

  // Mecato
  { id: 'mecato-bombones', nombre: 'Bombones', precio: 1000, categoria: 'Mecato', estado: 'disponible', imagen: '/productos/mecato-bombones.png' },
  { id: 'mecato-mani-moto', nombre: 'Maní Moto', precio: 2500, categoria: 'Mecato', estado: 'disponible', imagen: '/productos/mecato-mani-moto.png' },
  { id: 'mecato-traidet', nombre: 'Traidet', precio: 3000, categoria: 'Mecato', estado: 'disponible', imagen: '/productos/mecato-traidet.png' },
  { id: 'mecato-chao', nombre: 'Chao', precio: 2500, categoria: 'Mecato', estado: 'disponible', imagen: '/productos/mecato-chao.png' },
  { id: 'mecato-de-toditos', nombre: 'De Toditos', precio: 5000, categoria: 'Mecato', estado: 'disponible', sabores: ['Mix', 'BBQ', 'Limón', 'Natural', 'Pollo'], imagen: '/productos/mecato-de-toditos.png' },
  { id: 'mecato-margarita-limon', nombre: 'Margarita Limón', precio: 5000, categoria: 'Mecato', estado: 'disponible', imagen: '/productos/mecato-margarita-limon.png' },
  { id: 'mecato-margarita-natural', nombre: 'Margarita Natural', precio: 5000, categoria: 'Mecato', estado: 'disponible', imagen: '/productos/mecato-margarita-natural.jpg' },
  { id: 'mecato-margarita-pollo', nombre: 'Margarita Pollo', precio: 5000, categoria: 'Mecato', estado: 'disponible', imagen: '/productos/mecato-margarita-pollo.png' },
  { id: 'mecato-onduladas-mayonesa', nombre: 'Onduladas Mayonesa', precio: 5000, categoria: 'Mecato', estado: 'disponible' },
  { id: 'mecato-onduladas-tomate', nombre: 'Onduladas Tomate', precio: 5000, categoria: 'Mecato', estado: 'disponible' },
  { id: 'mecato-cheetos', nombre: 'Cheetos', precio: 5000, categoria: 'Mecato', estado: 'disponible' },
  { id: 'mecato-natuchips', nombre: 'Natuchips', precio: 5000, categoria: 'Mecato', estado: 'disponible' },
  { id: 'mecato-doritos', nombre: 'Doritos', precio: 5000, categoria: 'Mecato', estado: 'disponible' },
  { id: 'mecato-chochitos-medianos', nombre: 'Chochitos Medianos', precio: 10000, categoria: 'Mecato', estado: 'disponible' },
  { id: 'mecato-chochitos-grandes', nombre: 'Chochitos Grandes', precio: 5000, categoria: 'Mecato', estado: 'disponible' },
  { id: 'mecato-chochitos-pequenos', nombre: 'Chochitos Pequeños', precio: 3000, categoria: 'Mecato', estado: 'disponible' },

  // Bebidas
  { id: 'bebida-electrolit', nombre: 'Electrolit', precio: 12000, categoria: 'Bebidas', estado: 'disponible', sabores: ['Uva', 'Fresa Kiwi', 'Jamaica', 'Maracuyá'] },
  { id: 'bebida-gatorade', nombre: 'Gatorade', precio: 6000, categoria: 'Bebidas', estado: 'disponible', sabores: ['Rojo', 'Azul', 'Naranja'] },
  { id: 'bebida-soda-grande', nombre: 'Soda Grande', precio: 7000, categoria: 'Bebidas', estado: 'disponible' },
  { id: 'bebida-soda-pequena', nombre: 'Soda Pequeña', precio: 5000, categoria: 'Bebidas', estado: 'disponible' },
  { id: 'bebida-agua', nombre: 'Agua', precio: 2500, categoria: 'Bebidas', estado: 'disponible' },
  { id: 'bebida-vive100', nombre: 'Vive 100', precio: 5000, categoria: 'Bebidas', estado: 'disponible', sabores: ['Original', 'Sandía'] },

  // Alcohol
  { id: 'alcohol-jose-cuervo', nombre: 'José Cuervo', precio: 90000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-jose-cuervo-media', nombre: 'José Cuervo Media', precio: 60000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-baileys', nombre: 'Baileys', precio: 110000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-old-parr', nombre: 'Old Parr', precio: 170000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-buchanans-deluxe', nombre: "Buchanan's Deluxe", precio: 220000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-buchanans-master', nombre: "Buchanan's Máster", precio: 270000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-aguardiente-antioqueno', nombre: 'Aguardiente Antioqueño', precio: 60000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-aguardiente-antioqueno-media', nombre: 'Aguardiente Antioqueño Media', precio: 35000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-aguardiente-caucano', nombre: 'Aguardiente Caucano', precio: 58000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-aguardiente-caucano-media', nombre: 'Aguardiente Caucano Media', precio: 30000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-aguardiente-amarillo', nombre: 'Aguardiente Amarillo', precio: 70000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-aguardiente-amarillo-media', nombre: 'Aguardiente Amarillo Media', precio: 40000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-smirnoff-tamarindo', nombre: 'Smirnoff Tamarindo', precio: 70000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-smirnoff-lulo', nombre: 'Smirnoff Lulo', precio: 70000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-smirnoff-lulo-media', nombre: 'Smirnoff Lulo Media', precio: 35000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-ron-tradicional', nombre: 'Ron Tradicional', precio: 70000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-ron-tradicional-media', nombre: 'Ron Tradicional Media', precio: 40000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-ron-esencial', nombre: 'Ron Esencial', precio: 68000, categoria: 'Alcohol', estado: 'disponible' },
  { id: 'alcohol-ron-esencial-media', nombre: 'Ron Esencial Media', precio: 38000, categoria: 'Alcohol', estado: 'disponible' },
]

// Categorías derivadas del catálogo (en el orden en que aparecen), para no
// mantener una lista aparte que se pueda desincronizar de los productos.
export const CATEGORIES = [...new Set(PRODUCTS.map((p) => p.categoria))]
