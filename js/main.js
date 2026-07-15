$(function () {
  "use strict";

  let $backToTop = $("#backToTop");
  let $contactForm = $("#contactForm");
  let $formFeedback = $("#formFeedback");

  // Año dinámico en el footer
  $("#year").text(new Date().getFullYear());

  // Menú móvil (Slicknav sobre la lista de navegación)
  if ($.fn.slicknav) {
    $(".nav__list").slicknav({
      appendTo: ".header__inner",
      label: "",
      allowParentLinks: true
    });
  }

  // Scroll con inercia (Lenis); las anclas pasan por lenis.scrollTo
  // Mientras la timeline de entrada del hero (GSAP) anima el layout, las
  // medidas de getBoundingClientRect() de cualquier ancla son provisionales:
  // el primer click calcularía el centrado con alturas que aún van a cambiar.
  let introTl = null;
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis();
    let raf = function (time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    if (window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
    }
  }

  $(document).on("click", 'a[href^="#"]', function (event) {
    let href = $(this).attr("href");

    if (lenis && href === "#top") {
      // El hero se centra verticalmente dentro de ".above-fold", así que su borde
      // superior no coincide con scrollY 0: ir "arriba del todo" debe apuntar al
      // documento, no a la sección, o el offset del header lo deja a mitad del hueco.
      event.preventDefault();
      
      lenis.scrollTo(0);
    }else if (lenis && href.length > 1 && $(href).length) {
      event.preventDefault();

      // Los bloques de solución son largos: centrarlos en pantalla en vez de
      // pegarlos arriba ayuda a ver de un vistazo dónde empieza y termina cada uno.
      // Si el bloque no cabe entero, el offset se limita a 0 para no perder su inicio.
      let scrollToTarget = function () {
        let targetEl = $(href)[0];

        // Si el bloque destino todavía no jugó su animación de aparición
        // (GSAP + ScrollTrigger, más abajo), sigue con el "y: 40" de partida
        // aplicado: medir su altura/posición ahora daría un resultado que
        // cambiará en cuanto el ScrollTrigger se dispare al llegar el scroll.
        // Se fuerza a su estado final antes de medir para que coincida ya
        // desde el primer click.
        if (window.ScrollTrigger) {
          let trigger = ScrollTrigger.getAll().filter(function (st) {
            return st.trigger === targetEl;
          })[0];
          if (trigger && trigger.progress < 1) {
            trigger.animation.progress(1);
          }
        }

        let blockHeight = targetEl.getBoundingClientRect().height;
        let centerOffset = -(window.innerHeight - blockHeight) / 2;
        
        if(href === "#contacto"){
            let headerHeight = - $(".header").outerHeight();
            centerOffset += headerHeight
        }
        lenis.scrollTo(href, { offset: centerOffset });
      };

      // Si la intro del hero (GSAP) todavía está animando, sus cambios de altura
      // desactualizan cualquier medida tomada ahora mismo: hay que esperar a que
      // termine para que el centrado se calcule sobre el layout ya asentado.
      if (introTl && introTl.isActive()) {
        introTl.eventCallback("onComplete", scrollToTarget);
      } else {
        scrollToTarget();
      }
    }

    // Cierra el menú móvil tras navegar
    if ($.fn.slicknav && $(this).closest(".slicknav_nav").length) {
      $(".nav__list").slicknav("close");
    }
  });

  // Carrusel de texto del hero (Swiper) — 1 frase a la vez, avanza sola con fade
  if (window.Swiper) {
    new Swiper(".text-swiper", {
      slidesPerView: 1,
      effect: "fade",
      fadeEffect: { crossFade: true },
      loop: true,
      speed: 800,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false
      }
    });
  }

  // Lightbox de imágenes (Magnific Popup)
  if ($.fn.magnificPopup) {
    $(".image-popup").magnificPopup({
      type: "image",
      mainClass: "mfp-fade",
      image: { verticalFit: true }
    });
  }

  // Entrada del bloque "above the fold" (hero + carrusel) al cargar la página.
  // No depende de scroll porque ya es visible sin desplazarse: se anima con un timeline propio.
  if (window.gsap) {
    introTl = gsap.timeline({ defaults: { ease: "power2.out" } });

    introTl.from(".hero .eyebrow", { opacity: 0, y: 16, duration: 0.5 });

    if (window.SplitType) {
      // Split solo en ".hero__typed": ".hero__highlight" lleva el degradado y no se
      // puede trocear en chars, porque cada char perdería el "background-clip: text".
      let heroSplit = new SplitType(".hero__typed", { types: "words,chars" });
      introTl.from(heroSplit.chars, {
        opacity: 0,
        y: 24,
        duration: 0.5,
        stagger: 0.02
      }, "-=0.25");
    } else {
      introTl.from(".hero__typed", { opacity: 0, y: 24, duration: 0.5 }, "-=0.25");
    }

    introTl
      .from(".hero__highlight", { opacity: 0, y: 24, duration: 0.5 }, "-=0.3")
      .from(".hero__lead", { opacity: 0, y: 16, duration: 0.5 }, "-=0.2")
      .from(".text-swiper", { opacity: 0, y: 30, duration: 0.6 }, "-=0.15");
  }

  // Mostrar/ocultar botón "volver arriba"
  $(window).on("scroll", function () {
    $backToTop.toggleClass("is-visible", $(window).scrollTop() > 400);
  });

  // Envío del formulario de contacto (demo, sin backend)
  $contactForm.on("submit", function (event) {
    event.preventDefault();

    if (!this.checkValidity()) {
      $formFeedback
        .removeClass("is-success")
        .addClass("is-error")
        .text("Por favor, completa todos los campos correctamente.");
      return;
    }

    // Aquí iría la llamada AJAX real, por ejemplo:
    // $.post("/api/contacto", $contactForm.serialize())
    //   .done(function () { ... })
    //   .fail(function () { ... });

    $formFeedback
      .removeClass("is-error")
      .addClass("is-success")
      .text("¡Gracias! Hemos recibido tu mensaje.");

    $contactForm[0].reset();
  });

  // Cursor personalizado (solo ratón: pointer fino + soporte de hover)
  let $cursor = $("#customCursor");
  let darkSurfaceSelector = ".footer, .stats";
  if ($cursor.length && window.matchMedia("(pointer: fine) and (hover: hover)").matches) {
    $(document).on("mousemove", function (event) {
      $cursor.addClass("is-active").css({ left: event.clientX, top: event.clientY });
      $cursor.toggleClass("is-on-dark", Boolean($(event.target).closest(darkSurfaceSelector).length));
    });
    $(document).on("mouseleave", function () {
      $cursor.removeClass("is-active");
    });
    $(document).on("mouseenter", "a, button, input, textarea, select, label, .btn, [role='button']", function () {
      $cursor.addClass("is-hovering");
    });
    $(document).on("mouseleave", "a, button, input, textarea, select, label, .btn, [role='button']", function () {
      $cursor.removeClass("is-hovering");
    });
  }

  // Contadores animados de la franja de estadísticas
  function animateCounter($el) {
    let text = $el.text().trim();
    let match = text.match(/^([\d.,]+)(.*)$/);
    if (!match) {
      return;
    }

    let digits = match[1];
    let suffix = match[2];
    let useThousandsDot = digits.indexOf(".") > -1;
    let target = parseInt(digits.replace(/[.,]/g, ""), 10);

    $({ count: 0 }).animate(
      { count: target },
      {
        duration: 1200,
        easing: "swing",
        step: function () {
          let value = Math.floor(this.count);
          $el.text((useThousandsDot ? value.toLocaleString("es-ES") : value) + suffix);
        },
        complete: function () {
          $el.text(digits + suffix);
        }
      }
    );
  }

  // Resalta la solución activa en los chips de navegación al hacer scroll
  let $solutionNavLinks = $("#solutionNav .solution-nav__link");
  if ("IntersectionObserver" in window && $solutionNavLinks.length) {
    let solutionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          let id = entry.target.getAttribute("id");
          $solutionNavLinks
            .removeClass("is-active")
            .filter('[href="#' + id + '"]')
            .addClass("is-active");
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    document.querySelectorAll(".solution[id]").forEach(function (el) {
      solutionObserver.observe(el);
    });
  }

  if ("IntersectionObserver" in window) {
    let statObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter($(entry.target));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    document.querySelectorAll(".stat__value").forEach(function (el) {
      statObserver.observe(el);
    });
  }

  // Animaciones de aparición al hacer scroll (GSAP + ScrollTrigger, si están cargados)
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".stat", {
      scrollTrigger: { trigger: ".stats", start: "top 85%" },
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });

    gsap.utils.toArray(".solution").forEach(function (solution) {
      gsap.from(solution, {
        scrollTrigger: { trigger: solution, start: "top 85%" },
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: "power2.out"
      });
    });

    gsap.from(".sector-strip__item", {
      scrollTrigger: { trigger: ".sector-strip", start: "top 85%" },
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out"
    });

    gsap.utils.toArray([".feature__inner", ".about__content", ".form"]).forEach(
      function (el) {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: "power2.out"
        });
      }
    );
  }
});
