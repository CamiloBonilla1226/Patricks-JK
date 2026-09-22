// Dos ruletas de 12 premios cada una. Cuál de las dos se muestra se sortea
// 50/50 cada vez que se abre el modal — ver RuletaModal.jsx. La
// probabilidad de cada premio depende de cuántas veces aparece en su lista
// (todos los segmentos tienen el mismo tamaño) — no agregar pesos por
// separado, EXCEPTO el caso especial `raro` explicado abajo.
//
// Antes eran 8 casillas por ruleta. Se subió a 12 repitiendo los premios
// "normales" (no se agregó más "Perdiste" ni "Sigue intentando" — eso
// habría hecho la ruleta más negativa en general, justo lo contrario de lo
// que se pidió). El único premio que sigue apareciendo una sola vez por
// ruleta es el más grande de cada una ($30.000 y 1 Six), y además llevan
// `raro: true`.
//
// `raro: true` es un premio "casi imposible" a propósito: aparte de tener
// una sola casilla de 12, RuletaModal.jsx aplica un sorteo adicional en el
// momento de elegir a qué casilla ir (antes de empezar a girar, para que la
// rueda nunca se detenga visualmente en un premio y anuncie otro) — solo lo
// mantiene 1 de cada 5 veces que el azar cae ahí; las otras 4 se redirige a
// otra casilla no-rara. Con eso, la probabilidad real de sacar $30.000 o el
// Six queda bastante por debajo del 1/12 que tienen las demás casillas.
//
// `codigo` es el código corto que identifica el premio en el mensaje de
// WhatsApp (ver generarCodigoPremio en utils/ruleta.js) — el texto completo
// del premio nunca se manda por WhatsApp, para que el cliente no pueda
// editarlo antes de enviar el pedido. `null` en "Perdiste" y "Sigue
// intentando" porque ninguno de los dos es un premio real que deba
// codificarse. Los premios repetidos llevan el mismo código que el
// original — son la misma casilla de premio, solo aparece más de una vez.
export const PREMIOS_RULETA_A = [
  { id: 'a1', texto: 'Ganaste 1 Poker', codigo: '1PK' },
  { id: 'a2', texto: 'Perdiste', codigo: null },
  { id: 'a3', texto: 'Ganaste $10.000 redimible en punto físico', codigo: '10K' },
  { id: 'a4', texto: 'Sigue intentando', codigo: null },
  { id: 'a5', texto: 'Ganaste un bombón', codigo: 'BOM' },
  { id: 'a6', texto: 'Perdiste', codigo: null },
  { id: 'a7', texto: '10% en el total de la cuenta', codigo: '10C' },
  { id: 'a8', texto: 'Ganaste 1 Poker', codigo: '1PK' },
  { id: 'a9', texto: 'Ganaste $30.000', codigo: '30K', raro: true },
  { id: 'a10', texto: 'Ganaste un bombón', codigo: 'BOM' },
  { id: 'a11', texto: '10% en el total de la cuenta', codigo: '10C' },
  { id: 'a12', texto: 'Ganaste $10.000 redimible en punto físico', codigo: '10K' },
]

export const PREMIOS_RULETA_B = [
  { id: 'b1', texto: 'Ganaste un premio sorpresa', codigo: 'SOR' },
  { id: 'b2', texto: 'Perdiste', codigo: null },
  { id: 'b3', texto: '10% descuento en un producto seleccionado', codigo: '10P' },
  { id: 'b4', texto: 'Sigue intentando', codigo: null },
  { id: 'b5', texto: 'Ganaste un agua', codigo: 'AGU' },
  { id: 'b6', texto: 'Perdiste', codigo: null },
  { id: 'b7', texto: '5% en el total de la cuenta', codigo: '5TC' },
  { id: 'b8', texto: 'Ganaste un premio sorpresa', codigo: 'SOR' },
  { id: 'b9', texto: 'Ganaste 1 Six', codigo: '1SX', raro: true },
  { id: 'b10', texto: 'Ganaste un agua', codigo: 'AGU' },
  { id: 'b11', texto: '5% en el total de la cuenta', codigo: '5TC' },
  { id: 'b12', texto: '10% descuento en un producto seleccionado', codigo: '10P' },
]
