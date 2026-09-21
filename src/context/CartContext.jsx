import { createContext, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

const initialState = { items: [] }

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Si el producto ya está en el carrito, se suma a esa misma línea en
      // vez de crear una fila repetida.
      const existing = state.items.find((item) => item.productId === action.item.productId)
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === existing.id ? { ...item, cantidad: item.cantidad + 1 } : item,
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, id: crypto.randomUUID(), cantidad: 1 }],
      }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.id) }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const value = useMemo(() => {
    const total = state.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    const count = state.items.reduce((sum, item) => sum + item.cantidad, 0)
    return {
      items: state.items,
      count,
      total,
      addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
      removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
    }
  }, [state.items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook co-located con su provider a propósito
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
