# Hitesh Panwar — AI Governance Portfolio

A single-page portfolio site. Pure HTML, CSS, and vanilla JavaScript
(ES modules) — **no frameworks, no build tools, no dependencies.**

Originally authored as a React-runtime "Design Component" (`.dc.html`);
this version is a faithful, framework-free port. The rendered output is
identical, but it no longer loads React from a CDN or relies on a runtime
engine — it's just static files a browser can serve directly.

## Project structure

```
.
├── index.html            # the whole page (static markup, no inline styles/JS)
├── css/
│   ├── tokens.css        # design tokens: colours, fonts, breakpoints (:root vars)
│   ├── base.css          # resets, document defaults, shared primitives
│   ├── animations.css    # @keyframes, reveal/fade transitions, reduced-motion
│   ├── sections.css      # per-section layout (nav, hero, about, network, …)
│   └── responsive.css    # all media queries, consolidated
├── js/
│   ├── main.js           # entry point — imports & initialises every module
│   ├── loader.js         # hero loading sequence + character reveal
│   ├── scroll.js         # progress bar, sticky nav, section indicator, scroll-reveal, mobile menu
│   ├── cursor-glow.js    # cursor glow (hover-capable devices only)
│   ├── case-studies.js   # horizontal drag-to-scroll (desktop) + touch fallback
│   ├── neural-network.js # skill → output diagram, signal pulses, mobile fallback
│   └── counters.js       # stat count-up animation
├── assets/               # favicon + room for images/icons
└── README.md
```

Every colour, font-family, and breakpoint is defined once in
`css/tokens.css` and referenced with `var(--token)` elsewhere. Each JS
file exports a single `init…()` function; `main.js` calls them on
`DOMContentLoaded`.

### Editing the neural network

The skill → work mapping lives in one well-commented object,
`SKILL_OUTPUT_MAP`, at the top of `js/neural-network.js`. Adding a skill
or an output is a documented three-step change (markup + map row, and for
a new output one extra `.nn-idle-*` rule in `animations.css`).

## Run it locally

ES modules are fetched over HTTP, so **opening `index.html` directly with
a `file://` URL will fail** — the browser blocks module loading with a
CORS error. You must serve the folder over `http://`.

From the project root, pick whichever is handy:

```bash
# Python 3 (built in on macOS / most Linux)
python -m http.server 8000

# or Node
npx serve .

# or PHP
php -S localhost:8000
```

Then open **http://localhost:8000/** in your browser. Stop the server with
`Ctrl + C`.

## Deploy to GitHub Pages

All asset paths in `index.html` are **relative** (`css/…`, `js/…`,
`assets/…`, and in-page links like `#about`), so the site works correctly
whether it's served from a domain root or a project subpath such as
`https://<you>.github.io/<repo>/`.

1. Create the repo and push:

   ```bash
   git init
   git add .
   git commit -m "AI Governance portfolio — static site"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main**, folder: **/ (root)** → **Save**

3. Wait ~1 minute, then visit `https://<you>.github.io/<repo>/`.

No build step or GitHub Action is required — Pages serves the files as-is.

## Notes

- **JavaScript is required** (as in the original). With JS disabled the
  hero stays hidden behind the loader, since the reveal is JS-driven.
- **`prefers-reduced-motion`** is respected: the loader is skipped,
  scroll reveals appear instantly, and neural-network idle motion and
  signal pulses are suppressed.
- The original source files (`Portfolio.dc.html`, `Hero.dc.html`,
  `support.js`, the architecture doc) are **not used** by the deployed
  site and can be deleted or moved out of the repo once you're happy with
  the port.
- The favicon in `assets/favicon.svg` is a placeholder — swap in your own.
