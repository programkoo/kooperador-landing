# Kooperador LP

Landing page estática (HTML + CSS + JS + jQuery) para Kooperador Group,
con contenido y branding tomados de `docs/`.

## Estructura

```
├── src/
│   ├── index.html        # Página principal (hero, sectores, ecosistema, sobre nosotros, contacto)
│   ├── css/
│   │   └── style.css     # Variables de marca (colores, tipografía), secciones, responsive
│   ├── js/
│   │   └── main.js       # Interactividad con jQuery (menú móvil, formulario, scroll)
│   ├── vendor/
│   │   └── jquery/        # Fallback local de jQuery si falla el CDN (colocar jquery.min.js aquí)
│   └── assets/
│       └── img/            # Imágenes usadas en la página, copiadas desde docs/img
└── docs/                    # Documentación de marca y contenidos (fuente, no se publica)
    ├── 01 DEFINICION DE KOOPERADOR GROUP(1).docx
    ├── Kooperador_Branding.doc
    └── img/                  # Banco de imágenes original
```

## Cómo probarlo

Al ser HTML/CSS/JS puro no requiere build. Basta con abrir `src/index.html` en el navegador,
o servirlo con un servidor estático simple desde `src/`:

```bash
cd src
npx serve .
```

## Contenido y marca

El contenido (textos, productos, propuesta de valor) y la identidad visual (colores, tipografía,
tono) se han extraído de:

- `docs/01 DEFINICION DE KOOPERADOR GROUP(1).docx` — descripción de Kooperador Group y su
  ecosistema de productos: **Koomparador**, **Koolaborador**, **Koodice** y **Kooclock**.
- `docs/Kooperador_Branding.doc` — ficha de identidad de marca (logotipo, paleta de colores,
  tipografía Manrope/Roboto, tono visual).

Paleta aplicada en `src/css/style.css` (`:root`):

| Uso | Color |
|---|---|
| Primario (verde lima) | `#94C11E` |
| Primario hover (verde oscuro) | `#86AF1B` |
| Secundario (morado) | `#824DED` |
| Acento (naranja) | `#FF8500` |
| Texto (gris oscuro) | `#495057` |
| Texto fuerte (gris carbón) | `#262626` |

## Notas

- **Todas las librerías se sirven en local** desde `src/vendor/` (sin CDNs): jQuery 3.7.1,
  GSAP 3.12.5 + ScrollTrigger, Lenis, Swiper 11, Magnific Popup 1.1.0, SplitType 0.3.4,
  SlickNav 1.0.10 y Bootstrap Grid 5.3.3. La página funciona sin conexión.
- Si añades imágenes nuevas del banco original (`docs/img/`), cópialas a `src/assets/img/` —
  `docs/` no se despliega, solo `src/`.
- El formulario de contacto es una demo sin backend; el punto de conexión AJAX está comentado
  en `src/js/main.js`.

## Mejoras de UI (`docs/control_net_ui.md`)

Todas inicializadas con guardas en `src/js/main.js` — si una librería no carga, el resto de la
página sigue funcionando:

- **Lenis**: scroll con inercia; las anclas internas pasan por `lenis.scrollTo` con offset para
  el header fijo. CSS de soporte en `style.css` (bloque "Lenis").
- **GSAP + ScrollTrigger**: animaciones de aparición al hacer scroll en tarjetas de producto,
  estadísticas, bloques de solución, sectores, feature, sobre nosotros y formulario.
- **SplitType + GSAP**: titular del hero animado letra a letra (`types: "words,chars"` para que
  no se partan las palabras).
- **Swiper**: carrusel de tarjetas de producto bajo el hero (1 tarjeta en móvil, 2 en tablet,
  4 en escritorio), con fallback CSS a grid si no se inicializa.
- **Magnific Popup**: lightbox listo para usar — basta añadir la clase `.image-popup` a un
  enlace que apunte a una imagen (ahora mismo no hay imágenes que lo usen).
- **SlickNav**: menú hamburguesa móvil (se genera solo a partir de `.nav__list`; el `<nav>`
  original se oculta en ≤768px). Tematizado con la marca en `style.css`.
- **Bootstrap Grid**: cargado antes de `style.css` (que siempre prevalece); disponible por si
  se necesitan `.row`/`.col-*` en nuevas secciones.
- **Contadores animados** en la franja de estadísticas: `jQuery.animate` + `IntersectionObserver`
  (sin plugin extra; Waypoints/CounterUp no parsean bien "15.000+" / "24/7").
- **Cursor personalizado**: solo en dispositivos con ratón (`pointer: fine` y `hover: hover`).
