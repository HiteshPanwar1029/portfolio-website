/* ============================================================
   loader.js — the kinetic hero loader.

   Counts 0→100 over ~2.5s, then slides the overlay up and reveals
   the hero by adding `.is-revealed` to `.site` (CSS in animations.css
   handles the character / fade transitions). Per-character and
   per-element transition delays are computed here, mirroring the
   original renderVals() stagger maths so they adapt if the copy
   changes.

   prefers-reduced-motion: skip the count, reveal immediately.
   ============================================================ */

export function initLoader() {
  const root = document.querySelector('.site');
  if (!root) return;

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countNum = document.querySelector('.loader-count-num');
  const bar = document.querySelector('.loader-bar');

  assignRevealDelays(root);

  const reveal = () => root.classList.add('is-revealed');

  // Reduced motion (or no rAF): show the finished state at once.
  if (reduce) {
    if (countNum) countNum.textContent = '100';
    if (bar) bar.style.width = '100%';
    reveal();
    return;
  }

  const setProgress = (v) => {
    if (countNum) countNum.textContent = String(v).padStart(2, '0');
    if (bar) bar.style.width = v + '%';
  };

  const dur = 2467;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 2);          // quadratic ease-out
    setProgress(Math.round(eased * 100));
    if (t < 1) requestAnimationFrame(tick);
    else setTimeout(reveal, 560);
  };
  requestAnimationFrame(tick);
}

/* Assign the staggered transition-delays exactly as the original
   computed them in renderVals(). */
function assignRevealDelays(root) {
  // Hero name: base 0.05s, step 0.05s per character.
  const nameChars = root.querySelectorAll('.hero-name .char');
  nameChars.forEach((el, i) => { el.style.transitionDelay = (0.05 + i * 0.05).toFixed(3) + 's'; });

  // Hero subtitle: starts after the name finishes, step 0.014s.
  const titleBase = 0.05 + nameChars.length * 0.05 + 0.25;
  const titleChars = root.querySelectorAll('.hero-subtitle .char');
  titleChars.forEach((el, i) => { el.style.transitionDelay = (titleBase + i * 0.014).toFixed(3) + 's'; });
  const tEnd = titleBase + titleChars.length * 0.014;

  // Hero fade-in groups (eyebrow, nav, positioning, meta).
  setDelay(root.querySelector('.hero-eyebrow'), 0.05);
  setDelay(root.querySelector('.nav-inner'), 0.15);
  root.querySelectorAll('.hero-positioning').forEach((el) => setDelay(el, tEnd + 0.2));
  root.querySelectorAll('.hero-meta-tr, .hero-meta-bl, .scroll-cue').forEach((el) => setDelay(el, tEnd + 0.4));
}

function setDelay(el, seconds) {
  if (el) el.style.transitionDelay = seconds.toFixed(2) + 's';
}
