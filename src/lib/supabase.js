import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Si faltan las variables de entorno, `supabase` queda en null en vez de
// lanzar aquí: este módulo se importa desde varias pantallas (carrito,
// ruleta) y un error al cargarlo rompería toda la app. Cada función que use
// el cliente (ver ruleta.js) falla al llamarse, no al importarse, para que
// el try/catch de quien la llama pueda mostrar o ignorar el error sin
// bloquear el resto de la carta.
let supabase = null

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
} else {
  console.error(
    'Faltan las variables de entorno VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. Revisa tu archivo .env.local'
  )
}

export default supabase
