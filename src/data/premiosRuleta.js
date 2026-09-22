// Los 16 premios de la ruleta, en el orden exacto de los 16 segmentos de la
// rueda. La probabilidad de cada uno depende únicamente de cuántas veces
// aparece en esta lista (todos los segmentos tienen el mismo tamaño) — no
// agregar pesos ni probabilidades por separado, y no agregar ni quitar
// premios sin que se pida explícitamente.
export const PREMIOS_RULETA = [
  { id: 'r1', texto: 'Perdiste' },
  { id: 'r2', texto: '10% descuento en un producto seleccionado' },
  { id: 'r3', texto: 'Sigue intentando' },
  { id: 'r4', texto: 'Ganaste 1 Poker' },
  { id: 'r5', texto: 'Ganaste $30.000' },
  { id: 'r6', texto: 'Perdiste' },
  { id: 'r7', texto: 'Sigue intentando' },
  { id: 'r8', texto: 'Ganaste 1 Six' },
  { id: 'r9', texto: 'Ganaste $10.000 redimible en punto físico' },
  { id: 'r10', texto: 'Perdiste' },
  { id: 'r11', texto: 'Sigue intentando' },
  { id: 'r12', texto: 'Ganaste un agua' },
  { id: 'r13', texto: 'Ganaste un bombón' },
  { id: 'r14', texto: '10% en el total de la cuenta' },
  { id: 'r15', texto: '5% en el total de la cuenta' },
  { id: 'r16', texto: 'Ganaste un premio sorpresa' },
]
