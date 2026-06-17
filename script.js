/* =========================================================
   INDUQUIMAQ METALÚRGICA — SCRIPT
   ========================================================= */

(() => {
  'use strict';

  /* ============================================================
     UTILITÁRIOS
     ============================================================ */

  const $ = (selector, parent = document) =>
    parent ? parent.querySelector(selector) : null;

  const $$ = (selector, parent = document) =>
    parent ? [...parent.querySelectorAll(selector)] : [];

  const safeStorage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {}
    }
  };

  /* ============================================================
     1. TEMA CLARO / ESCURO
     ============================================================ */

  const themeToggle = $('#themeToggle');
  const THEME_KEY = 'induquimaq-theme';

  function applyTheme(theme) {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    safeStorage.set(THEME_KEY, theme);
  }

  function getPreferredTheme() {
    const storedTheme = safeStorage.get(THEME_KEY);

    if (storedTheme) {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme =
        document.documentElement.getAttribute('data-theme') === 'dark'
          ? 'dark'
          : 'light';

      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  const darkModeMedia = window.matchMedia(
    '(prefers-color-scheme: dark)'
  );

  darkModeMedia.addEventListener('change', (event) => {
    if (!safeStorage.get(THEME_KEY)) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  });

  /* ============================================================
     2. HEADER
     ============================================================ */

  const header = $('#header');

  function updateHeader() {
    if (!header) return;

    header.classList.toggle(
      'is-scrolled',
      window.scrollY > 20
    );
  }

  /* ============================================================
   3. MENU MOBILE
   ============================================================ */

const menuToggle = $('#menuToggle');
const nav = $('#nav');

function closeMenu() {
  if (!menuToggle || !nav) return;

  menuToggle.classList.remove('is-active');
  menuToggle.setAttribute('aria-expanded', 'false');

  nav.classList.remove('is-open');

  document.body.style.overflow = '';
}

function openMenu() {
  if (!menuToggle || !nav) return;

  menuToggle.classList.add('is-active');
  menuToggle.setAttribute('aria-expanded', 'true');

  nav.classList.add('is-open');

  document.body.style.overflow = 'hidden';
}

if (menuToggle && nav) {

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();

    if (nav.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  $$('.nav__link', nav).forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('click', (event) => {
    if (
      nav.classList.contains('is-open') &&
      !nav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener(
    'touchstart',
    (event) => {
      if (
        nav.classList.contains('is-open') &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    },
    { passive: true }
  );

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) {
      closeMenu();
    }
  });
}

  /* ============================================================
     4. ACTIVE NAV LINK
     ============================================================ */

  const sections = $$('section[id]');
  const navLinks = $$('.nav__link');

  function setActiveLink() {
    if (!sections.length || !navLinks.length) return;

    let currentSection = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPosition) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        'is-active',
        link.getAttribute('href') === `#${currentSection}`
      );
    });
  }

  /* ============================================================
     5. REVEAL ON SCROLL
     ============================================================ */

  const revealElements = $$('[data-reveal]');

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((element) =>
      revealObserver.observe(element)
    );
  }

  /* ============================================================
     6. CARROSSEL DE PROCESSO
     ============================================================ */

  const carousel = $('#processCarousel');

  if (carousel) {
    const slides = $$('.process-carousel__slide', carousel);
    const dots = $$('.process-carousel__dot', carousel);

    const btnPrev = $('#carouselPrev');
    const btnNext = $('#carouselNext');

    let currentSlide = 0;
    let autoTimer = null;

    function goToSlide(index) {
      if (!slides.length) return;

      slides[currentSlide]?.classList.remove('is-active');
      dots[currentSlide]?.classList.remove('is-active');

      currentSlide =
        (index + slides.length) % slides.length;

      slides[currentSlide]?.classList.add('is-active');
      dots[currentSlide]?.classList.add('is-active');
    }

    function stopAuto() {
      if (!autoTimer) return;

      clearInterval(autoTimer);
      autoTimer = null;
    }

    function startAuto() {
      stopAuto();

      autoTimer = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 4000);
    }

    btnPrev?.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      startAuto();
    });

    btnNext?.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      startAuto();
    });

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = Number(dot.dataset.index);

        if (Number.isNaN(index)) return;

        goToSlide(index);
        startAuto();
      });
    });

    let touchStartX = 0;

    carousel.addEventListener(
      'touchstart',
      (event) => {
        touchStartX = event.touches[0]?.clientX || 0;
      },
      { passive: true }
    );

    carousel.addEventListener('touchend', (event) => {
      const touchEndX =
        event.changedTouches[0]?.clientX || 0;

      const difference = touchStartX - touchEndX;

      if (Math.abs(difference) <= 40) return;

      goToSlide(
        difference > 0
          ? currentSlide + 1
          : currentSlide - 1
      );

      startAuto();
    });

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    const carouselObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startAuto();
        } else {
          stopAuto();
        }
      },
      { threshold: 0.3 }
    );

    carouselObserver.observe(carousel);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAuto();
      } else {
        startAuto();
      }
    });
  }

  /* ============================================================
     7. LIGHTBOX
     ============================================================ */

  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  const lightboxCaption = $('#lightboxCaption');
  const lightboxClose = $('#lightboxClose');

  const galleryItems = $$('[data-lightbox-src]');
  const galleryArray = [...galleryItems];

  let currentGalleryIndex = -1;

  function openLightbox(src, caption = '') {
    if (!lightbox || !lightboxImg) return;
    if (!src) return;

    lightboxImg.src = src;
    lightboxImg.alt = caption;

    if (lightboxCaption) {
      lightboxCaption.textContent = caption;
    }

    lightbox.classList.add('is-active');
    lightbox.setAttribute('aria-hidden', 'false');

    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove('is-active');
    lightbox.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';

    setTimeout(() => {
      if (lightboxImg) {
        lightboxImg.src = '';
      }
    }, 300);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentGalleryIndex = index;

      openLightbox(
        item.dataset.lightboxSrc,
        item.dataset.lightboxCaption
      );
    });
  });

  lightboxClose?.addEventListener(
    'click',
    closeLightbox
  );

  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (
      !lightbox ||
      !lightbox.classList.contains('is-active')
    ) {
      return;
    }

    switch (event.key) {
      case 'Escape':
        closeLightbox();
        break;

      case 'ArrowRight':
        if (!galleryArray.length) return;

        currentGalleryIndex =
          (currentGalleryIndex + 1) %
          galleryArray.length;
        break;

      case 'ArrowLeft':
        if (!galleryArray.length) return;

        currentGalleryIndex =
          (currentGalleryIndex - 1 + galleryArray.length) %
          galleryArray.length;
        break;

      default:
        return;
    }

    if (
      event.key === 'ArrowRight' ||
      event.key === 'ArrowLeft'
    ) {
      const item =
        galleryArray[currentGalleryIndex];

      if (!item) return;

      openLightbox(
        item.dataset.lightboxSrc,
        item.dataset.lightboxCaption
      );
    }
  });

  /* ============================================================
     8. SMOOTH SCROLL
     ============================================================ */

  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');

      if (!href || href === '#') return;

      const target = $(href);

      if (!target) return;

      event.preventDefault();

      const offset =
        header?.offsetHeight || 0;

      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        offset;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    });
  });

  /* ============================================================
     9. WHATSAPP FLOAT
     ============================================================ */

  const whatsappFloat = $('.whatsapp-float');

  function updateWhatsapp() {
    if (!whatsappFloat) return;

    whatsappFloat.classList.toggle(
      'is-visible',
      window.scrollY > 300
    );
  }

  /* ============================================================
     10. SCROLL CENTRALIZADO
     ============================================================ */

  function handleScroll() {
    updateHeader();
    setActiveLink();
    updateWhatsapp();
  }

  window.addEventListener('scroll', handleScroll, {
    passive: true
  });

  handleScroll();

})();