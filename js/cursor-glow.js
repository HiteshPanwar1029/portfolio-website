/* ============================================================
   cursor-glow.js — radial glow that follows the pointer.

   Only enabled on hover-capable (non-touch) devices and when
   the user has not requested reduced motion; otherwise the glow
   element is hidden. The glow is 400px, so we offset by 200px to
   centre it on the cursor.
   ============================================================ */

export function initCursorGlow() {
  const glow = document.querySelector('.glow');
  if (!glow) return;

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = !window.matchMedia || window.matchMedia('(hover: hover)').matches;

  if (canHover && !reduce) {
    window.addEventListener('mousemove', (e) => {
      glow.style.transform = 'translate(' + (e.clientX - 200) + 'px,' + (e.clientY - 200) + 'px)';
    }, { passive: true });
  } else {
    glow.style.display = 'none';
  }
}
