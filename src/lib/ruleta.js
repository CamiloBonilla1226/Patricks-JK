import supabase from './supabase'

const YA_JUGO_KEY = 'ruleta_ya_jugo'

// Una vez que Supabase confirma que el dispositivo ya jugó, esa respuesta
// nunca puede cambiar de vuelta a "no ha jugado" — así que se cachea en
// localStorage para que las próximas veces que el cliente arme otro pedido
// el botón no tenga que esperar de nuevo una consulta de red.
function dispositivoYaJugoLocal() {
  return localStorage.getItem(YA_JUGO_KEY) === '1'
}

function marcarDispositivoComoJugadoLocal() {
  localStorage.setItem(YA_JUGO_KEY, '1')
}

/**
 * Verifica si un dispositivo ya giró la ruleta (existe un registro en
 * dispositivos_ruleta con ese device_id).
 * @param {string} deviceId
 * @returns {Promise<boolean>}
 */
export async function verificarSiYaJugo(deviceId) {
  if (dispositivoYaJugoLocal()) return true

  const { data, error } = await supabase
    .from('dispositivos_ruleta')
    .select('device_id')
    .eq('device_id', deviceId)
    .maybeSingle()

  if (error) throw error
  const yaJugo = data !== null
  if (yaJugo) marcarDispositivoComoJugadoLocal()
  return yaJugo
}

/**
 * Registra el giro de la ruleta de un dispositivo junto con el premio
 * obtenido. Debe llamarse una sola vez, justo después de que termina la
 * animación de la ruleta.
 * @param {string} deviceId
 * @param {string} premio
 * @param {number} porcentaje
 */
export async function registrarGiro(deviceId, premio, porcentaje) {
  const { error } = await supabase
    .from('dispositivos_ruleta')
    .insert({ device_id: deviceId, premio, porcentaje })

  if (error) throw error
  marcarDispositivoComoJugadoLocal()
}

/**
 * @typedef {Object} DatosPedido
 * @property {string|null} deviceId - null si el cliente no jugó la ruleta.
 * @property {string} nombre
 * @property {string} celular
 * @property {string} direccion
 * @property {number} subtotal
 * @property {number} descuentoAplicado
 * @property {number} total
 */

/**
 * Crea un pedido con los datos de entrega y el resumen de la compra.
 * @param {DatosPedido} pedido
 */
export async function crearPedido({
  deviceId,
  nombre,
  celular,
  direccion,
  subtotal,
  descuentoAplicado,
  total,
}) {
  const { error } = await supabase.from('pedidos').insert({
    device_id: deviceId ?? null,
    nombre,
    celular,
    direccion,
    subtotal,
    descuento_aplicado: descuentoAplicado,
    total,
  })

  if (error) throw error
}
