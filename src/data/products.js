// Datos de ejemplo — reemplazar por Supabase cuando exista el backend

/**
 * @typedef {Object} Producto
 * @property {string} id
 * @property {string} nombre
 * @property {number} precio
 * @property {string} categoria
 * @property {'disponible'|'agotado'} estado
 */

/** @type {Producto[]} */
export const PRODUCTS = [
  { id: 'cerv_aguila', nombre: 'Águila 330ml', precio: 5000, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerv_poker', nombre: 'Poker 330ml', precio: 5000, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerv_club_colombia', nombre: 'Club Colombia 330ml', precio: 6500, categoria: 'Cervezas', estado: 'disponible' },
  { id: 'cerv_corona', nombre: 'Corona 355ml', precio: 8000, categoria: 'Cervezas', estado: 'agotado' },

  { id: 'whisky_old_parr', nombre: 'Old Parr 750ml', precio: 130000, categoria: 'Whisky', estado: 'disponible' },
  { id: 'whisky_buchanans', nombre: "Buchanan's 12 750ml", precio: 150000, categoria: 'Whisky', estado: 'disponible' },
  { id: 'whisky_jw_black', nombre: 'Johnnie Walker Black 750ml', precio: 160000, categoria: 'Whisky', estado: 'agotado' },

  { id: 'ron_medellin', nombre: 'Ron Medellín Añejo 750ml', precio: 65000, categoria: 'Ron', estado: 'disponible' },
  { id: 'ron_viejo_caldas', nombre: 'Ron Viejo de Caldas 750ml', precio: 60000, categoria: 'Ron', estado: 'disponible' },
  { id: 'ron_zacapa', nombre: 'Ron Zacapa 23 750ml', precio: 220000, categoria: 'Ron', estado: 'disponible' },

  { id: 'agu_antioqueno', nombre: 'Aguardiente Antioqueño 750ml', precio: 55000, categoria: 'Aguardiente', estado: 'disponible' },
  { id: 'agu_nectar', nombre: 'Aguardiente Néctar 750ml', precio: 50000, categoria: 'Aguardiente', estado: 'disponible' },
  { id: 'agu_cristal', nombre: 'Aguardiente Cristal 750ml', precio: 48000, categoria: 'Aguardiente', estado: 'agotado' },

  { id: 'vodka_absolut', nombre: 'Absolut 750ml', precio: 90000, categoria: 'Vodka', estado: 'disponible' },
  { id: 'vodka_smirnoff', nombre: 'Smirnoff 750ml', precio: 70000, categoria: 'Vodka', estado: 'disponible' },

  { id: 'combo_agu_gaseosa', nombre: 'Combo Aguardiente + 2 gaseosas', precio: 65000, categoria: 'Combos', estado: 'disponible' },
  { id: 'combo_ron_energizante', nombre: 'Combo Ron + 4 energizantes', precio: 95000, categoria: 'Combos', estado: 'disponible' },
]

// Categorías derivadas del catálogo (en el orden en que aparecen), para no
// mantener una lista aparte que se pueda desincronizar de los productos.
export const CATEGORIES = [...new Set(PRODUCTS.map((p) => p.categoria))]
