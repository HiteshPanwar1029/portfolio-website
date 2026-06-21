/* ============================================================
   case-studies.js — horizontal drag-to-scroll for the case-study
   rail on desktop (pointer ≥1025px).

   Vertical wheel scrolls the page normally; trackpad / touch swipe
   and shift+wheel pan the rail natively. On touch devices the rail
   uses CSS scroll-snap (see responsive.css), so no JS is needed and
   this initialiser bails out.

   A drag of more than 3px suppresses the click that follows, so
   dragging the rail never accidentally triggers a card link.
   ============================================================ */

export function initCaseStudies() {
  const rail = document.querySelector('.cs-rail');
  const isDesktop = !window.matchMedia || window.matchMedia('(min-width: 1025px)').matches;
  if (!rail || !isDesktop) return;

  rail.style.cursor = 'grab';

  let down = false;
  let startX = 0;
  let startLeft = 0;
  let moved = false;

  const onDown = (e) => {
    down = true;
    moved = false;
    startX = e.pageX;
    startLeft = rail.scrollLeft;
    rail.style.cursor = 'grabbing';
  };
  const onMove = (e) => {
    if (!down) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 3) moved = true;
    rail.scrollLeft = startLeft - dx;
  };
  const onUp = () => {
    down = false;
    rail.style.cursor = 'grab';
  };
  const onClickCapture = (e) => {
    if (moved) { e.preventDefault(); e.stopPropagation(); }
  };

  rail.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  rail.addEventListener('click', onClickCapture, true);
}
