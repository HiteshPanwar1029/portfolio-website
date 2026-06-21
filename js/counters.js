/* ============================================================
   counters.js — count-up for the stat numbers.

   Each [data-count] element animates 0 → its target over 800ms with
   a quadratic ease-out the first time it scrolls into view (60%).
   The final value is already in the HTML, so under reduced motion we
   simply leave it as-is and skip the animation.
   ============================================================ */

export function initCounters() {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      animateCount(en.target);
      observer.unobserve(en.target);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-count]').forEach((el) => observer.observe(el));
}

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const dur = 800;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 2);
    el.textContent = Math.round(eased * target);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
