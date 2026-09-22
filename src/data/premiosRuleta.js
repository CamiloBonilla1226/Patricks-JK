// Dos ruletas de 8 premios cada una (antes era una sola de 16). Cuál de las
// dos se muestra se sortea 50/50 cada vez que se abre el modal — ver
// RuletaModal.jsx. La probabilidad de cada premio depende únicamente de
// cuántas veces aparece en su lista (todos los segmentos tienen el mismo
// tamaño) — no agregar pesos ni probabilidades por separado.
//
// La lista original de 16 solo traía 3 "Perdiste" en total, y cada ruleta de
// 8 necesita mínimo 2 — se agregó un "Perdiste" adicional (4 en total, 2 por
// ruleta) para cumplir ese mínimo en ambas.
//
// `codigo` es el código corto que identifica el premio en el mensaje de
// WhatsApp (ver generarCodigoPremio en utils/ruleta.js) — el texto completo
// del premio nunca se manda por WhatsApp, para que el cliente no pueda
// editarlo antes de enviar el pedido. `null` en "Perdiste" y "Sigue
// intentando" porque ninguno de los dos es un premio real que deba
// codificarse.
export const PREMIOS_RULETA_A = [
  { id: 'a1', texto: 'Perdiste', codigo: null },
  { id: 'a2', texto: 'Perdiste', codigo: null },
  { id: 'a3', texto: 'Sigue intentando', codigo: null },
  { id: 'a4', texto: 'Ganaste 1 Poker', codigo: '1PK' },
  { id: 'a5', texto: 'Ganaste $30.000', codigo: '30K' },
  { id: 'a6', texto: 'Ganaste $10.000 redimible en punto físico', codigo: '10K' },
  { id: 'a7', texto: '10% en el total de la cuenta', codigo: '10C' },
  { id: 'a8', texto: 'Ganaste un bombón', codigo: 'BOM' },
]

export const PREMIOS_RULETA_B = [
  { id: 'b1', texto: 'Perdiste', codigo: null },
  { id: 'b2', texto: 'Perdiste', codigo: null },
  { id: 'b3', texto: 'Sigue intentando', codigo: null },
  { id: 'b4', texto: '10% descuento en un producto seleccionado', codigo: '10P' },
  { id: 'b5', texto: 'Ganaste 1 Six', codigo: '1SX' },
  { id: 'b6', texto: 'Ganaste un agua', codigo: 'AGU' },
  { id: 'b7', texto: '5% en el total de la cuenta', codigo: '5TC' },
  { id: 'b8', texto: 'Ganaste un premio sorpresa', codigo: 'SOR' },
]
