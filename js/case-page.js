/* ============================================================
   case-page.js — entry point for individual case-study pages
   (case-studies/*.html).

   Reuses the shared modules: scroll.js gives the progress bar,
   frosted sticky nav, section indicator, scroll-reveal and the
   mobile menu; cursor-glow.js gives the pointer glow. There is
   no loader on subpages — content is readable immediately.
   ============================================================ */

import { initScroll } from './scroll.js';
import { initCursorGlow } from './cursor-glow.js';

function init() {
  initScroll();
  initCursorGlow();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
