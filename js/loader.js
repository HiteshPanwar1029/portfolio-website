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

/* Session flag: the intro loader plays once per browser tab. Any
   later navigation back to the home page (e.g. clicking the name in
   the nav from a project or case-study page) lands directly on the
   revealed hero — no replay. case-page.js sets the same flag. */
export const INTRO_SEEN_KEY = 'hp-intro-seen';

function introSeen() {
  try { return sessionStorage.getItem(INTRO_SEEN_KEY) === '1'; } catch { return false; }
}
function markIntroSeen() {
  try { sessionStorage.setItem(INTRO_SEEN_KEY, '1'); } catch { /* private mode — ignore */ }
}

export function initLoader() {
  const root = document.querySelector('.site');
  if (!root) return;

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countNum = document.querySelector('.loader-count-num');
  const bar = document.querySelector('.loader-bar');

  const reveal = () => root.classList.add('is-revealed');

  // Already seen this session (or reduced motion): skip straight to
  // the finished hero. .is-instant kills the reveal transitions and
  // hides the loader overlay (see animations.css).
  if (reduce || introSeen()) {
    markIntroSeen();
    root.classList.add('is-instant');
    if (countNum) countNum.textContent = '100';
    if (bar) bar.style.width = '100%';
    reveal();
    return;
  }

  markIntroSeen();
  assignRevealDelays(root);

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

  // Hero subtitle chars were removed with the subtitle; the maths
  // below still adapts if a .hero-subtitle ever returns.
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
