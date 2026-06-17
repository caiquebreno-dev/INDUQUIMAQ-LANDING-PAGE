/* =========================================================
   INDUQUIMAQ METALÚRGICA — SCRIPT
   ========================================================= */

(function () {
  'use strict';

  /* ============================================================
     1. TEMA CLARO / ESCURO
     ============================================================ */
  const themeToggle = document.getElementById('themeToggle');
  const THEME_KEY   = 'induquimaq-theme';

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Aplica tema salvo imediatamente para evitar flash
  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'dark'
        : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Respeita mudança do sistema operacional enquanto na página
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });


  /* ============================================================
     2. HEADER — scroll / sombra
     ============================================================ */
  const header = document.getElementById('header');

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();


  /* ============================================================
     3. MENU MOBILE
     ============================================================ */
  const menuToggle = document.getElementById('menuToggle');
  const nav        = document.getElementById('nav');

  function closeMenu() {
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function openMenu() {
    menuToggle.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    // Fecha ao clicar em um link de navegação
    nav.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Fecha ao redimensionar para desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }


  /* ============================================================
     4. ACTIVE NAV LINK — destaca o link da seção visível
     ============================================================ */
  const sections  = document.querySelectorAll('section[id], div[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  function setActiveLink() {
    let current = '';
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollY) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('is-active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();


  /* ============================================================
     5. REVEAL ON SCROLL — [data-reveal]
     ============================================================ */
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));


  /* ============================================================
     6. CONTADORES ANIMADOS — [data-counter]
     ============================================================ */
  const counterEls = document.querySelectorAll('[data-counter]');

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = 1400; // ms
    const step     = 16;   // ~60fps
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counterEls.forEach((el) => counterObserver.observe(el));


  /* ============================================================
     7. LIGHTBOX DA GALERIA
     ============================================================ */
  const lightbox        = document.getElementById('lightbox');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose   = document.getElementById('lightboxClose');
  const galleryItems    = document.querySelectorAll('[data-lightbox-src]');

  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src        = src;
    lightboxImg.alt        = caption || '';
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Animação de entrada
    requestAnimationFrame(() => {
      lightbox.classList.add('is-visible');
    });
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-visible');
    lightbox.setAttribute('aria-hidden', 'true');

    const onTransitionEnd = () => {
      lightbox.classList.remove('is-open');
      lightboxImg.src = '';
      document.body.style.overflow = '';
      lightbox.removeEventListener('transitionend', onTransitionEnd);
    };

    lightbox.addEventListener('transitionend', onTransitionEnd, { once: true });
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const src     = item.getAttribute('data-lightbox-src');
      const caption = item.getAttribute('data-lightbox-caption');
      openLightbox(src, caption);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Fecha com tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  // Navegação por teclado na galeria (setas)
  const galleryArr = Array.from(galleryItems);
  let currentIndex = -1;

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => { currentIndex = idx; });
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;

    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % galleryArr.length;
      const next = galleryArr[currentIndex];
      openLightbox(
        next.getAttribute('data-lightbox-src'),
        next.getAttribute('data-lightbox-caption')
      );
    }

    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + galleryArr.length) % galleryArr.length;
      const prev = galleryArr[currentIndex];
      openLightbox(
        prev.getAttribute('data-lightbox-src'),
        prev.getAttribute('data-lightbox-caption')
      );
    }
  });


  /* ============================================================
     8. SMOOTH SCROLL — links internos (#)
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ============================================================
     9. BOTÃO FLUTUANTE WHATSAPP — esconde ao rolar para o topo
     ============================================================ */
  const whatsappFloat = document.querySelector('.whatsapp-float');

  function updateWhatsapp() {
    if (!whatsappFloat) return;
    if (window.scrollY > 300) {
      whatsappFloat.classList.add('is-visible');
    } else {
      whatsappFloat.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', updateWhatsapp, { passive: true });
  updateWhatsapp();

})();
