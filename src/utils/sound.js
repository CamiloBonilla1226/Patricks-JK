// Sonido corto sintetizado con Web Audio API (sin archivos de audio) para
// confirmar que se agregó un producto al carrito. Se reutiliza el mismo
// AudioContext entre llamadas porque los navegadores limitan cuántos se
// pueden crear.
let audioCtx = null

export function playAddToCartSound() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    audioCtx = audioCtx || new Ctx()
    const ctx = audioCtx
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(660, now)
    osc.frequency.exponentialRampToValueAtTime(990, now + 0.09)

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.2)
  } catch {
    // Audio bloqueado o no soportado — se omite en silencio, no es crítico.
  }
}
