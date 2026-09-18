# CLAUDE.md — Proyecto Patrick's JK (carta digital + ruleta en React)

Este archivo son instrucciones permanentes para Claude Code / Codex en este
proyecto. Aplican a TODA tarea futura, no solo a la implementación inicial.
Antes de escribir o modificar código, relee este archivo si ha pasado tiempo
desde la última tarea.

Este proyecto nace como una copia del proyecto de BoraBora Granizados. La
base de componentes, estructura de carpetas y patrones de código vienen de
ahí, pero la identidad visual, los datos y el flujo de compra son distintos.

## 1. Mantener el mismo estilo (diseño y código)

### 1.1 Diseño visual — no te apartes de esto sin que te lo pidan
- Paleta fija, definida como variables CSS en `src/styles/tokens.css`. Nunca
  hardcodees un color distinto directo en un componente; usa las variables:
  - `--navy:#100C09` fondo general
  - `--navy-2:#191310` superficies elevadas (tarjetas, modal)
  - `--amber:#E8A33D` acento principal (botones, precios, llamados a la acción)
  - `--amber-soft:#F4C878` acento secundario / hover
  - `--teal:#39C6D1` estados positivos (disponible, abierto, confirmación)
  - `--cream:#F3ECDD` texto principal
  - `--cream-dim:#BFB6A2` texto secundario / placeholders
- Tipografías: Fraunces (600/700) para títulos y marca, Work Sans (400-600)
  para el resto del texto. No agregues una tercera familia sin pedir permiso.
- Fondo oscuro predominante (navy) con acentos ámbar y teal usados con
  moderación — para estados, badges, precios y llamados a la acción, no para
  fondos grandes.
- Bordes rectangulares y minimalistas: radios pequeños (4-8px), nada de
  esquinas muy redondeadas tipo "pill" salvo elementos circulares por
  naturaleza (la ruleta, indicadores de estado). Si vas a crear un
  componente nuevo, mira cómo se ven los componentes vecinos y replica esa
  consistencia en vez de inventar un estilo distinto.
- El encabezado superior (nombre + estado "Abierto") debe quedar fijo/anclado
  (`position: sticky`) en la parte superior en las tres secciones de la app
  (Inicio, Menú, Carrito), delgado, sin subtítulo.
- Navegación inferior tipo tabs (Inicio / Menú / Carrito), fija en la parte
  inferior, estilo heredado de BoraBora — no la cambies sin que se pida.
- Mobile-first siempre: diseña y prueba primero en ancho de celular (~400px)
  antes de preocuparte por pantallas grandes. Nunca debe aparecer scroll
  horizontal.

### 1.2 Estilo de código
- El proyecto es JavaScript puro — no actives TypeScript ni agregues
  archivos `.ts`/`.tsx`. Componentes en `.jsx`, datos y utilidades en `.js`.
- Para seguridad de tipos sin TypeScript: usa comentarios JSDoc (`@typedef`)
  describiendo formas de datos importantes (por ejemplo un producto), y
  valida props complejas con PropTypes.
- Sigue la estructura de carpetas ya establecida dentro de `src/`:
  `components/`, `screens/`, `data/`, `context/`, `styles/`, `utils/`. No
  reorganices esta estructura ni la dupliques con otra convención distinta.
- Componentes de función con hooks de React (`useState`, `useReducer`,
  `useContext`, etc.), nunca componentes de clase.
- Estado global compartido (como el carrito) va en Context + reducer, nunca
  en variables globales sueltas ni pasando props por muchos niveles.
- Los íconos van como componentes SVG de React o archivos `.svg`
  importados — nunca como strings de HTML armados a mano ni emojis.
- Antes de crear un componente nuevo, revisa si ya existe algo parecido que
  puedas reutilizar o extender en vez de duplicar lógica.

## 2. Datos de productos (quemados, sin Excel ni backend todavía)

- Este proyecto NO usa Excel como fuente de productos (a diferencia de
  BoraBora). Todos los productos viven quemados en
  `src/data/products.js`, exportados como un arreglo plano.
- Cada producto tiene exactamente esta forma:
  ```js
  /**
   * @typedef {Object} Producto
   * @property {string} id
   * @property {string} nombre
   * @property {number} precio
   * @property {string} categoria
   * @property {'disponible'|'agotado'} estado
   */
  ```
- No inventes campos adicionales (stock numérico, descripciones largas,
  imágenes por producto, etc.) a menos que se pida explícitamente.
- Un producto con `estado: 'agotado'` no debe poder agregarse al carrito y
  debe mostrarse visualmente distinto (atenuado + etiqueta "Agotado").
- Marca con un comentario explícito en `products.js` que estos datos son
  temporales: `// Datos de ejemplo — reemplazar por Supabase cuando exista
  el backend`.
- Cuando exista backend real (Supabase), este archivo se reemplaza por una
  consulta a la base de datos — no implementes esa parte todavía a menos
  que se pida explícitamente.

## 3. Seguridad de la web (no negociable)

- Nunca uses `dangerouslySetInnerHTML`.
- Ninguna clave, contraseña, token o secreto va escrito directamente en el
  código. Cualquier credencial futura va en variables de entorno (`.env`),
  nunca se sube a git (confirma que `.gitignore` incluya `.env`, `node_modules`
  y las carpetas de build).
- Antes de instalar una librería nueva, evalúa si es realmente necesaria;
  cada dependencia nueva es superficie de ataque adicional.
- Corre `npm audit` (o el equivalente del gestor de paquetes) periódicamente
  y corrige vulnerabilidades "high" o "critical" antes de seguir avanzando.
- Al desplegar, deben quedar activas las cabeceras de seguridad básicas:
  `Content-Security-Policy`, `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.
- Todo input de usuario (buscador, formulario de datos de entrega) debe
  validarse y limpiarse antes de usarse, para evitar inyección de código.
- El sitio debe servirse solo por HTTPS en producción.
- Los datos de productos/precios actuales son de ejemplo (mock, locales).
  Cuando se conecte un backend real, cualquier operación que escriba datos
  (pedidos, registro de dispositivo para la ruleta, panel de administrador)
  debe tener su propia validación — nunca queda abierta sin validar quién
  hace la petición.
- El identificador de dispositivo para la ruleta (`device_id`) se genera y
  guarda en el cliente (localStorage / `crypto.randomUUID()`). No es un
  mecanismo de seguridad fuerte — es un control de abuso liviano, no trates
  esta lógica como si fuera autenticación real.
- No expongas en el cliente ninguna lógica o dato que debería vivir solo en
  el backend (por ejemplo, reglas de negocio sensibles o llaves de servicios
  externos).

## 4. Mejores prácticas

- ESLint debe estar configurado con la config recomendada de React y sin
  errores pendientes antes de dar una tarea por terminada.
- Accesibilidad: modales/overlays (ruleta, formulario de entrega) deben
  poder cerrarse con Escape, clic fuera (backdrop) y un botón visible; el
  foco de teclado debe quedar atrapado dentro del modal mientras está
  abierto. Usa etiquetas y roles ARIA donde corresponda.
- Comentarios claros donde el código no sea autoexplicativo, especialmente
  en lógica de negocio (cálculo de descuentos, elegibilidad de la ruleta,
  condición de monto mínimo de compra). Marca con un comentario explícito
  cualquier dato o lógica que sea temporal/de ejemplo y deba reemplazarse
  más adelante.
- Evita duplicar lógica: si una regla de negocio (como el cálculo de un
  precio total, la elegibilidad para la ruleta o una condición de horario)
  se usa en más de un lugar, ponla en una sola función reutilizable en
  `utils/`, no la repitas.
- Haz commits pequeños y con mensajes claros describiendo qué cambió y por
  qué. No incluyas `node_modules` ni archivos `.env` en ningún commit.
- Antes de dar una tarea por terminada: pruébala en el navegador, en ancho
  de celular, y confirma que no rompiste ninguna pantalla que ya
  funcionaba.

## 5. Implementar de la manera más óptima

- Prioriza siempre simplicidad y legibilidad sobre soluciones ingeniosas
  pero difíciles de mantener. Este proyecto lo sigue construyendo alguien
  que no es programador de profesión — el código debe poder entenderse
  releyéndolo.
- No sobre-diseñes: implementa lo que la tarea pide, sin agregar
  funcionalidades, pantallas o abstracciones que no se pidieron todavía.
  En particular: NO implementes todavía backend/Supabase, tablas de
  dispositivos ni lógica de servidor para la ruleta — eso se hace en una
  fase posterior y explícita.
- Evita cálculos o renders innecesarios (por ejemplo, no recalcules el
  total del carrito en cada render si no cambió nada relevante; usa
  memoización solo cuando de verdad se note una mejora, no por costumbre).
- Prefiere las soluciones ya nativas de React/JavaScript moderno antes de
  agregar una librería nueva solo para resolver algo pequeño.
- Cuando haya más de una forma razonable de resolver algo, explica
  brevemente por qué elegiste esa antes de implementarla, si el impacto en
  la arquitectura del proyecto es grande.
- Si detectas que una instrucción pedida choca con alguna de las reglas de
  este archivo (estilo, seguridad, buenas prácticas), dilo antes de
  implementar y sugiere la alternativa correcta, en vez de aplicar la
  instrucción tal cual si eso introduce un riesgo o rompe la consistencia
  del proyecto.
- Haz los cambios en pasos pequeños y verificables. No mezcles varias
  tareas distintas (por ejemplo cambiar colores y cambiar la fuente de
  datos) en un mismo commit o en una misma pasada de cambios.

## Contexto del proyecto

Patrick's JK es un bar / licorería real. Esta app es la carta digital para
el cliente, con carrito de compras y confirmación de pedido por WhatsApp
(no hay pasarela de pago). Incluye una promoción de ruleta de descuentos:
si el subtotal del carrito es mayor o igual a $70.000 COP y el dispositivo
no ha jugado antes, el cliente puede girar la ruleta y el premio se aplica
a esa misma compra; si el dispositivo ya jugó, se salta la ruleta y va
directo al formulario de entrega (nombre, celular, dirección).

Por ahora todo funciona en el cliente, con datos de productos quemados
(sin Excel, sin backend) y el estado de la ruleta guardado en localStorage.
Planeado a futuro: backend real con Supabase (tablas `dispositivos_ruleta`
y `pedidos`) para que el control de "un giro por dispositivo" sea real y no
se pueda evadir borrando el localStorage. No implementes esa parte todavía
a menos que se pida explícitamente.