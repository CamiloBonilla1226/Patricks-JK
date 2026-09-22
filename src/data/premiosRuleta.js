// Dos ruletas de 8 premios cada una (antes era una sola de 16). Cuál de las
// dos se muestra se sortea 50/50 cada vez que se abre el modal — ver
// RuletaModal.jsx. La probabilidad de cada premio depende únicamente de
// cuántas veces aparece en su lista (todos los segmentos tienen el mismo
// tamaño) — no agregar pesos ni probabilidades por separado.
//
// La lista original de 16 solo traía 3 "Perdiste" en total, y cada ruleta de
// 8 necesita mínimo 2 — se agregó un "Perdiste" adicional (4 en total, 2 por
// ruleta) para cumplir ese mínimo en ambas.
export const PREMIOS_RULETA_A = [
  { id: 'a1', texto: 'Perdiste' },
  { id: 'a2', texto: 'Perdiste' },
  { id: 'a3', texto: 'Sigue intentando' },
  { id: 'a4', texto: 'Ganaste 1 Poker' },
  { id: 'a5', texto: 'Ganaste $30.000' },
  { id: 'a6', texto: 'Ganaste $10.000 redimible en punto físico' },
  { id: 'a7', texto: '10% en el total de la cuenta' },
  { id: 'a8', texto: 'Ganaste un bombón' },
]

export const PREMIOS_RULETA_B = [
  { id: 'b1', texto: 'Perdiste' },
  { id: 'b2', texto: 'Perdiste' },
  { id: 'b3', texto: 'Sigue intentando' },
  { id: 'b4', texto: '10% descuento en un producto seleccionado' },
  { id: 'b5', texto: 'Ganaste 1 Six' },
  { id: 'b6', texto: 'Ganaste un agua' },
  { id: 'b7', texto: '5% en el total de la cuenta' },
  { id: 'b8', texto: 'Ganaste un premio sorpresa' },
]
