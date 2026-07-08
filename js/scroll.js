/* ============================================================
   scroll.js — scroll-driven UI:
     • top progress bar (scroll position → width)
     • sticky nav frosted-glass transition past 60% of the hero
     • scroll-reveal for [data-reveal] elements (adds .is-shown)
     • mobile hamburger menu

   prefers-reduced-motion: reveal elements are shown immediately
   (the CSS reduced-motion block also forces them visible).
   ============================================================ */

export function initScroll() {
  const progress = document.querySelector('.progress');
  const nav = document.querySelector('.nav');
  const hero = document.querySelector('.hero');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Scroll-reveal ----
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  if (reduce) {
    revealEls.forEach((el) => el.classList.add('is-shown'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const d = parseInt(el.dataset.delay || '0', 10);
        el.style.transitionDelay = (d / 1000) + 's';
        el.classList.add('is-shown');   // CSS resolves up vs wipe end-state
        io.unobserve(el);
      });
    }, { threshold: 0.18 });
    revealEls.forEach((el) => io.observe(el));
  }

  // ---- Progress bar + sticky nav ----
  const onScroll = () => {
    const sc = window.scrollY || document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (sc / h) * 100 : 0) + '%';

    const heroH = hero ? hero.offsetHeight : window.innerHeight;
    const past = sc > heroH * 0.6;
    if (nav) {
      // Inline colours mirror tokens: --bg @0.82 scrim, --fg @0.08 border.
      nav.style.background = past ? 'rgba(10,10,15,0.82)' : 'transparent';
      nav.style.backdropFilter = past ? 'blur(12px)' : 'none';
      nav.style.webkitBackdropFilter = past ? 'blur(12px)' : 'none';
      nav.style.borderBottomColor = past ? 'rgba(240,237,230,0.08)' : 'transparent';
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  initMobileMenu();
}

/* Hamburger menu toggle (≤768px). Locks body scroll while open and
   keeps aria-expanded / aria-label in sync. */
function initMobileMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.menu');
  if (!burger || !menu) return;

  let open = false;
  const setMenu = (next) => {
    open = next;
    menu.style.transform = open ? 'translateX(0)' : 'translateX(100%)';
    document.body.style.overflow = open ? 'hidden' : '';
    const lines = burger.querySelectorAll('.burger-line');
    if (lines.length >= 2) {
      lines[0].style.transform = open ? 'translateY(4px) rotate(45deg)' : 'none';
      lines[1].style.transform = open ? 'translateY(-4px) rotate(-45deg)' : 'none';
    }
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  burger.addEventListener('click', () => setMenu(!open));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
}
