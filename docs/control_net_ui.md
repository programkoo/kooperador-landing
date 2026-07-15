2# Ficha técnica UI/UX - Recreación funcional
(Basado en el análisis de controlnet.es - librerías open-source, sin código propietario del theme)

## 1. Scroll suave

```css
html {
  scroll-behavior: smooth;
}
```

Alternativa con inercia (librería open-source Lenis):

```html
<script src="https://unpkg.com/lenis@1/dist/lenis.min.js"></script>
<script>
const lenis = new Lenis();
function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
</script>
```

## 2. Cursor personalizado

HTML:
```html
<div class="custom-cursor"></div>
```

CSS:
```css
.custom-cursor {
  position: fixed;
  top: 0; left: 0;
  width: 40px; height: 40px;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: transform .15s ease-out, opacity .3s;
  z-index: 9999;
}
```

JS:
```js
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
```

## 3. Animaciones al hacer scroll (GSAP + ScrollTrigger)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script>
gsap.registerPlugin(ScrollTrigger);
gsap.from(".seccion", {
  scrollTrigger: { trigger: ".seccion", start: "top 80%" },
  opacity: 0, y: 50, duration: 1
});
</script>
```

## 4. Otras librerías open-source detectadas en el stack

- Swiper.js -> carruseles/sliders con scrollbar propia
- WOW.js + animate.css -> animaciones "reveal" al entrar en viewport
- jQuery Waypoints + CounterUp -> contadores animados
- Magnific Popup -> modales/lightbox
- SplitText (plugin de pago de GSAP) -> animar texto letra a letra; alternativa gratuita: SplitType
- Slicknav -> menú hamburguesa responsive
- Bootstrap -> grid y componentes base
- jQuery 3.7.1 -> base de manipulación DOM

## Nota

Esta ficha es una recreación funcional con librerías open-source para lograr efectos similares.
No incluye código propietario del theme comercial "desarrollo25" usado en el sitio original.
