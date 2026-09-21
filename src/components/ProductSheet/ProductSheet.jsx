import { useEffect, useRef, useState } from 'react'
import CupArt from '../CupArt'
import { PRODUCTS } from '../../data/products'
import { useCart } from '../../context/CartContext'
import { useDisponibilidad } from '../../context/DisponibilidadContext'
import { resolveProductAvailability } from '../../utils/availability'
import { formatPrice } from '../../utils/format'
import './ProductSheet.css'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

const DRAG_LOCK_DISTANCE = 10 // px que hay que moverse para decidir si el gesto es un arrastre
const DRAG_CLOSE_DISTANCE = 110 // px de arrastre para considerar que se quiere cerrar
const DRAG_ANIMATION_MS = 220

export default function ProductSheet({ productId, onClose }) {
  const { addItem } = useCart()
  const { isAvailable } = useDisponibilidad()
  const productBase = PRODUCTS.find((p) => p.id === productId)
  const product = resolveProductAvailability(productBase, isAvailable)
  const disponible = product.estado === 'disponible'
  const requiereSabor = Boolean(product.sabores?.length)

  const [added, setAdded] = useState(false)
  const [selectedSabor, setSelectedSabor] = useState(null)

  const sheetRef = useRef(null)
  const heroRef = useRef(null)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !sheetRef.current) return

      const focusable = [...sheetRef.current.querySelectorAll(FOCUSABLE_SELECTOR)]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      } else if (!sheetRef.current.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  // Arrastrar para cerrar: deslizar de izquierda a derecha en cualquier
  // parte de la ficha (como "salir" del producto), o bajar desde la imagen
  // de arriba (como cualquier bottom-sheet). La ficha sigue el dedo en vivo
  // y, al soltar, o se termina de esconder (y ahí se cierra de verdad) o
  // vuelve a su lugar si no se arrastró lo suficiente.
  useEffect(() => {
    const sheet = sheetRef.current
    const hero = heroRef.current
    if (!sheet) return

    let axis = null // 'x' | 'y' | 'none' | null (sin decidir aún)
    let dragging = false
    let startX = 0
    let startY = 0

    function endDrag(shouldClose) {
      sheet.style.transition = `transform ${DRAG_ANIMATION_MS}ms ease, opacity ${DRAG_ANIMATION_MS}ms ease`
      if (shouldClose) {
        sheet.style.transform =
          axis === 'x' ? 'translateX(calc(-50% + 100vw))' : 'translate(-50%, 100%)'
        sheet.style.opacity = '0'
        window.setTimeout(onClose, DRAG_ANIMATION_MS)
      } else {
        sheet.style.transform = ''
        sheet.style.opacity = ''
      }
      axis = null
      dragging = false
    }

    function onTouchStart(e) {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      axis = null
      dragging = false
    }

    function onTouchMove(e) {
      const touch = e.touches[0]
      const dx = touch.clientX - startX
      const dy = touch.clientY - startY

      if (!axis) {
        if (Math.abs(dx) < DRAG_LOCK_DISTANCE && Math.abs(dy) < DRAG_LOCK_DISTANCE) return
        const startedOnHero = hero?.contains(e.target)
        if (startedOnHero && dy > DRAG_LOCK_DISTANCE && dy > Math.abs(dx)) {
          axis = 'y'
        } else if (dx > DRAG_LOCK_DISTANCE && dx > Math.abs(dy)) {
          axis = 'x'
        } else {
          axis = 'none'
        }
        if (axis !== 'none') {
          dragging = true
          sheet.style.transition = 'none'
        }
      }

      if (!dragging) return
      e.preventDefault()

      if (axis === 'x') {
        const offset = Math.max(0, dx)
        sheet.style.transform = `translateX(calc(-50% + ${offset}px))`
        sheet.style.opacity = String(Math.max(0.3, 1 - offset / 300))
      } else if (axis === 'y') {
        const offset = Math.max(0, dy)
        sheet.style.transform = `translate(-50%, ${offset}px)`
        sheet.style.opacity = String(Math.max(0.3, 1 - offset / 300))
      }
    }

    function onTouchEnd(e) {
      if (!dragging) {
        axis = null
        return
      }
      const touch = e.changedTouches[0]
      const dx = touch.clientX - startX
      const dy = touch.clientY - startY
      const shouldClose = (axis === 'x' && dx > DRAG_CLOSE_DISTANCE) || (axis === 'y' && dy > DRAG_CLOSE_DISTANCE)
      endDrag(shouldClose)
    }

    function onTouchCancel() {
      if (dragging) endDrag(false)
      axis = null
    }

    sheet.addEventListener('touchstart', onTouchStart, { passive: true })
    sheet.addEventListener('touchmove', onTouchMove, { passive: false })
    sheet.addEventListener('touchend', onTouchEnd, { passive: true })
    sheet.addEventListener('touchcancel', onTouchCancel, { passive: true })
    return () => {
      sheet.removeEventListener('touchstart', onTouchStart)
      sheet.removeEventListener('touchmove', onTouchMove)
      sheet.removeEventListener('touchend', onTouchEnd)
      sheet.removeEventListener('touchcancel', onTouchCancel)
    }
  }, [onClose])

  function handleAdd() {
    if (!disponible) return
    if (requiereSabor && !selectedSabor) return
    addItem({
      productId: product.id,
      nombre: product.nombre,
      categoria: product.categoria,
      precio: product.precio,
      sabor: requiereSabor ? selectedSabor : undefined,
    })
    setAdded(true)
    setSelectedSabor(null)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="overlay">
      <div className="backdrop" onClick={onClose}></div>
      <div className="sheet" ref={sheetRef} role="dialog" aria-modal="true" aria-labelledby="sheetName">
        <div className="sheet-scroll">
          <div className="sheet-hero" ref={heroRef}>
            <button ref={closeBtnRef} className="sheet-close" onClick={onClose} aria-label="Cerrar">
              ✕
            </button>
            <div className="cupwrap">
              <CupArt variant={product.art} />
            </div>
          </div>
          <div className="sheet-top">
            <h3 id="sheetName">{product.nombre}</h3>
            <span className={'status' + (disponible ? ' ok' : '')}>{disponible ? 'Disponible' : 'Agotado'}</span>
          </div>
          <div className="sheet-body">
            <div className="field-label">Categoría</div>
            <p className="sheet-desc">{product.categoria}</p>

            {requiereSabor && (
              <div className="group">
                <div className="group-label">
                  <span>Sabor</span>
                  {!selectedSabor && <span className="group-hint">Elige uno</span>}
                </div>
                <div className="opt-row" role="radiogroup" aria-label="Sabor">
                  {product.sabores.map((sabor) => (
                    <button
                      key={sabor}
                      type="button"
                      className="opt"
                      role="radio"
                      aria-checked={selectedSabor === sabor}
                      onClick={() => setSelectedSabor(sabor)}
                    >
                      {sabor}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="sheet-footer">
          <div className="amt">
            <span>Total</span>
            <b>{formatPrice(product.precio)}</b>
          </div>
          <button
            className="add-btn"
            onClick={handleAdd}
            disabled={!disponible || added || (requiereSabor && !selectedSabor)}
          >
            {!disponible ? 'Agotado' : added ? '¡Agregado!' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  )
}
