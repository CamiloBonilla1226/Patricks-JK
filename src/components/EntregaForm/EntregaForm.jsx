import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconCheck } from '../Icons'
import { obtenerDeviceId } from '../../lib/deviceId'
import { crearPedido } from '../../lib/ruleta'
import './EntregaForm.css'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/**
 * Formulario de entrega que se muestra al presionar "Realizar pedido" desde
 * el carrito. Pide nombre, celular y dirección, guarda el pedido en Supabase
 * (sin bloquear la venta si eso falla) y abre el enlace de WhatsApp que ya
 * arma el carrito. Termina mostrando una pantalla de confirmación.
 *
 * Por ahora no hay ruleta conectada, así que siempre se envía sin descuento
 * (descuentoAplicado: 0) — eso se conecta en una tarea aparte.
 */
export default function EntregaForm({ subtotal, whatsappLink, onClose, onFinish }) {
  const [nombre, setNombre] = useState('')
  const [celular, setCelular] = useState('')
  const [direccion, setDireccion] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState('form') // 'form' | 'success'

  const sheetRef = useRef(null)
  const closeBtnRef = useRef(null)
  const nombreInputRef = useRef(null)
  const successBtnRef = useRef(null)

  // En el paso de éxito ya no tiene sentido "cerrar sin más": el pedido ya
  // se envió, así que salir del modal (Escape, backdrop) equivale a volver
  // al inicio.
  function handleDismiss() {
    if (step === 'success') {
      onFinish()
    } else {
      onClose()
    }
  }

  useEffect(() => {
    const previouslyFocused = document.activeElement
    document.body.style.overflow = 'hidden'
    ;(closeBtnRef.current ?? nombreInputRef.current ?? successBtnRef.current)?.focus()

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        handleDismiss()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleDismiss depende de `step`, se re-suscribe con él vía closure fresca en cada render
  }, [step])

  async function handleSubmit(e) {
    e.preventDefault()

    const errors = {}
    if (!nombre.trim()) errors.nombre = true
    if (!celular.trim()) errors.celular = true
    if (!direccion.trim()) errors.direccion = true
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      const deviceId = obtenerDeviceId()
      await crearPedido({
        deviceId,
        nombre: nombre.trim(),
        celular: celular.trim(),
        direccion: direccion.trim(),
        subtotal,
        descuentoAplicado: 0,
        total: subtotal,
      })
    } catch (err) {
      // El pedido por WhatsApp es lo prioritario: si Supabase falla, no se
      // le muestra nada al cliente ni se bloquea el envío.
      console.error('No se pudo guardar el pedido en Supabase:', err)
    }

    window.open(whatsappLink, '_blank', 'noopener,noreferrer')
    setSubmitting(false)
    setStep('success')
  }

  // Portal a document.body: el carrito vive dentro de un contenedor que
  // queda con `transform` puesto por la animación de cambio de pantalla
  // (screen-transition, ver App.css), y eso rompe `position: fixed` — sin
  // el portal, el overlay no cubriría toda la pantalla (el TopBar quedaría
  // por encima y se llevaría los clics del backdrop).
  return createPortal(
    <div className="overlay">
      <div className="backdrop" onClick={handleDismiss}></div>
      <div
        className="sheet entrega-sheet"
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="entregaTitle"
      >
        {step === 'form' ? (
          <>
            <div className="sheet-top">
              <h3 id="entregaTitle">Datos de entrega</h3>
              <button ref={closeBtnRef} className="sheet-close" onClick={onClose} aria-label="Cerrar">
                ✕
              </button>
            </div>
            <form className="entrega-form" onSubmit={handleSubmit} noValidate>
              <div className="entrega-field">
                <label htmlFor="entrega-nombre">Nombre</label>
                <input
                  id="entrega-nombre"
                  ref={nombreInputRef}
                  type="text"
                  autoComplete="name"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.nombre)}
                  aria-describedby={fieldErrors.nombre ? 'entrega-nombre-error' : undefined}
                />
                {fieldErrors.nombre && (
                  <p className="entrega-error" id="entrega-nombre-error">
                    Escribe tu nombre.
                  </p>
                )}
              </div>

              <div className="entrega-field">
                <label htmlFor="entrega-celular">Celular</label>
                <input
                  id="entrega-celular"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.celular)}
                  aria-describedby={fieldErrors.celular ? 'entrega-celular-error' : undefined}
                />
                {fieldErrors.celular && (
                  <p className="entrega-error" id="entrega-celular-error">
                    Escribe tu celular.
                  </p>
                )}
              </div>

              <div className="entrega-field">
                <label htmlFor="entrega-direccion">Dirección</label>
                <input
                  id="entrega-direccion"
                  type="text"
                  autoComplete="street-address"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.direccion)}
                  aria-describedby={fieldErrors.direccion ? 'entrega-direccion-error' : undefined}
                />
                {fieldErrors.direccion && (
                  <p className="entrega-error" id="entrega-direccion-error">
                    Escribe tu dirección.
                  </p>
                )}
              </div>

              <button type="submit" className="entrega-submit-btn" disabled={submitting}>
                {submitting ? 'Enviando...' : 'Enviar pedido por WhatsApp'}
              </button>
            </form>
          </>
        ) : (
          <div className="entrega-success">
            <IconCheck className="entrega-success-ico" strokeWidth="1.8" />
            <h3>¡Pedido enviado!</h3>
            <p>Revisa WhatsApp para confirmar tu pedido con nosotros.</p>
            <button ref={successBtnRef} type="button" className="entrega-submit-btn" onClick={onFinish}>
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
