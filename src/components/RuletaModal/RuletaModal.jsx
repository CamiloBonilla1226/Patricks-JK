import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PREMIOS_RULETA } from '../../data/premiosRuleta'
import { useCart } from '../../context/CartContext'
import { registrarGiro } from '../../lib/ruleta'
import { SIGUE_INTENTANDO, extraerPorcentaje } from '../../utils/ruleta'
import './RuletaModal.css'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

const SEGMENT_DEG = 360 / PREMIOS_RULETA.length
const EXTRA_SPINS = 5 // vueltas completas antes de frenar en el premio elegido
const SPIN_DURATION_MS = 4000

// Colores del segmento alternando 3 tonos claros de la paleta (nada de
// --navy-2: sobre el fondo negro del modal se confundía con el backdrop y
// esos segmentos parecían "huecos" negros). Los tres son lo bastante claros
// como para usar siempre el mismo texto oscuro de contraste.
const SEGMENT_COLORS = ['var(--cream-dim)', 'var(--amber)', 'var(--teal)']
const SEGMENT_TEXT_COLOR = 'var(--ink-on-accent)'

const wheelBackground = `conic-gradient(${PREMIOS_RULETA.map((_, i) => {
  const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length]
  return `${color} ${i * SEGMENT_DEG}deg ${(i + 1) * SEGMENT_DEG}deg`
}).join(', ')})`

/**
 * Calcula la rotación total (en grados, siempre creciente respecto a la
 * anterior) para que el segmento `targetIndex` quede exactamente bajo el
 * puntero fijo de arriba, después de dar varias vueltas completas.
 */
function calcularRotacion(rotacionActual, targetIndex) {
  const centroSegmento = targetIndex * SEGMENT_DEG + SEGMENT_DEG / 2
  const moduloObjetivo = (360 - centroSegmento + 360) % 360
  const moduloActual = ((rotacionActual % 360) + 360) % 360
  let delta = moduloObjetivo - moduloActual
  if (delta <= 0) delta += 360
  return rotacionActual + EXTRA_SPINS * 360 + delta
}

/**
 * Modal de la ruleta de descuentos. Se abre cuando el carrito es elegible
 * (subtotal mínimo y dispositivo sin jugar, verificado por quien la abre) y
 * el dispositivo aún no ha jugado. Por ahora solo determina y muestra el
 * premio y lo guarda en el carrito (CartContext) — aplicarlo al total es la
 * Parte 3, que todavía no existe.
 */
export default function RuletaModal({ deviceId, onClose, onCompleted }) {
  const { setPremio } = useCart()
  const [fase, setFase] = useState('listo') // 'listo' | 'girando' | 'sigue' | 'resultado'
  const [rotacion, setRotacion] = useState(0)
  const [resultado, setResultado] = useState(null)

  const sheetRef = useRef(null)
  const closeBtnRef = useRef(null)
  const wheelRef = useRef(null)
  const targetIndexRef = useRef(null)

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

  function handleGirar() {
    if (fase === 'girando') return
    const targetIndex = Math.floor(Math.random() * PREMIOS_RULETA.length)
    targetIndexRef.current = targetIndex
    setResultado(null)
    setFase('girando')
    setRotacion((actual) => calcularRotacion(actual, targetIndex))
  }

  async function registrarSiCorresponde(texto) {
    try {
      await registrarGiro(deviceId, texto, extraerPorcentaje(texto))
    } catch (err) {
      // Control de abuso liviano: si Supabase falla, no se bloquea al
      // cliente, solo queda sin registrar que ya jugó.
      console.error('No se pudo registrar el giro de la ruleta en Supabase:', err)
    }
  }

  function handleTransitionEnd(e) {
    if (e.target !== wheelRef.current || e.propertyName !== 'transform' || fase !== 'girando') return

    const premio = PREMIOS_RULETA[targetIndexRef.current]
    setResultado(premio)

    if (premio.texto === SIGUE_INTENTANDO) {
      setFase('sigue')
      return
    }

    setFase('resultado')
    setPremio({ texto: premio.texto, porcentaje: extraerPorcentaje(premio.texto) })
    registrarSiCorresponde(premio.texto)
  }

  const esPerdiste = resultado?.texto === 'Perdiste'

  // Portal a document.body: el carrito vive dentro de un contenedor que
  // queda con `transform` puesto por la animación de cambio de pantalla
  // (screen-transition, ver App.css), y eso rompe `position: fixed` — sin
  // el portal, el overlay no cubriría toda la pantalla.
  //
  // Esta ventana ocupa toda la pantalla (ver RuletaModal.css), así que no
  // hay un "afuera" del diálogo donde hacer clic para cerrar — el cierre
  // queda cubierto con Escape y el botón ✕ visible, los otros dos métodos
  // exigidos para modales.
  return createPortal(
    <div className="overlay">
      <div
        className="ruleta-sheet"
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ruletaTitle"
      >
        <div className="ruleta-top">
          <h3 id="ruletaTitle">¡Gira la ruleta!</h3>
          <button ref={closeBtnRef} className="ruleta-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="ruleta-body">
          <div className="ruleta-wheel-wrap">
            <div className="ruleta-pointer" aria-hidden="true"></div>
            <div
              className="ruleta-wheel"
              ref={wheelRef}
              style={{
                background: wheelBackground,
                transform: `rotate(${rotacion}deg)`,
                transition: `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.12, 0.67, 0.16, 1)`,
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {PREMIOS_RULETA.map((premio, i) => (
                <div
                  key={premio.id}
                  className="ruleta-label"
                  style={{
                    transform: `rotate(${i * SEGMENT_DEG + SEGMENT_DEG / 2}deg)`,
                    color: SEGMENT_TEXT_COLOR,
                  }}
                >
                  <span>{premio.texto}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ruleta-result-area">
            {fase === 'sigue' && (
              <p className="ruleta-result ruleta-result-neutral">{resultado.texto}</p>
            )}
            {fase === 'resultado' && (
              <p className={`ruleta-result ${esPerdiste ? 'ruleta-result-neutral' : 'ruleta-result-premio'}`}>
                {resultado.texto}
              </p>
            )}
          </div>
        </div>

        <div className="ruleta-actions">
          {fase === 'sigue' ? (
            <button type="button" className="ruleta-btn" onClick={handleGirar}>
              Girar de nuevo
            </button>
          ) : fase === 'resultado' ? (
            <button type="button" className="ruleta-btn" onClick={onCompleted}>
              Continuar
            </button>
          ) : (
            <button type="button" className="ruleta-btn" onClick={handleGirar} disabled={fase === 'girando'}>
              {fase === 'girando' ? 'Girando...' : 'Girar'}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
