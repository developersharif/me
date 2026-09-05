# Copilot Instructions — Sharif Portfolio (Vue 3 + GSAP + Lenis)

## Overview

Single-page portfolio. One continuous surface: root CSS tokens (`--bg`, `--fg`,
`--muted`, `--line`, `--accent`, `--accent-text`) are tweened by GSAP as chapters
with `data-theme="paper|accent|ink"` enter the viewport. No section paints its
own background.

## Architecture

- `src/App.vue` — mounts intro curtain, custom cursor, nav, sections, footer.
  Initializes Lenis, chapter theming and active-section tracking (updates the
  URL hash with `history.replaceState`).
- `src/data/portfolio.json` — all copy, links and image refs. Typed by
  `src/types.ts`. Add content here, not in components.
- `src/sections/*.vue` — one component per chapter. Each receives its data
  slice and a two-digit `index` for the chapter head.
- `src/components/` — `SiteNav` (progress line + full-screen vermilion menu),
  `IntroCurtain` (once per session, skipped under reduced motion),
  `SignalCursor` (pointer: fine only), `Oscilloscope` (hero canvas),
  `WorkPlate` (responsive WebP or terminal plate), `SignalBars`, `Marquee`.
- `src/directives/` — `v-reveal` and `v-split` (registered globally in
  `main.ts`). Both are no-ops under `prefers-reduced-motion: reduce`.
- `src/composables/useSmoothScroll.ts` — Lenis instance; use `scrollToTarget`
  for programmatic scrolling and `lockScroll` when opening overlays.

## Conventions

- `<script setup lang="ts">`, scoped styles, design tokens via CSS variables.
- Motion: GSAP inside `gsap.context()` scoped to the component root, reverted
  in `onBeforeUnmount`. Wrap conditional/responsive animation in
  `gsap.matchMedia()`. Animate transform/opacity only.
- Never hide content with `gsap.set(autoAlpha: 0)` outside a
  `(prefers-reduced-motion: no-preference)` match.
- Public assets: use `asset()` / `workSrc()` from `useAssets.ts` so paths work
  under the `/me/` GitHub Pages base.
- Fonts: Fraunces (display), Instrument Sans (body), IBM Plex Mono (labels).
  Use `.display`, `.h2`, `.h3`, `.lede`, `.mono` from `styles/main.css`.

## Build & deploy

- `npm run dev`, `npm run build` (base `/me/`), `npm run preview`.
- `.github/workflows/deploy.yml` deploys `dist/` to GitHub Pages on push to `main`.

## Gotchas

- Lenis keeps native scrolling, so `position: sticky` works; ScrollTrigger
  `pin` is used only for the desktop work strip.
- Images: add new plates as `public/assets/work/<slug>-800.webp` and
  `<slug>-1600.webp` and reference `{ slug, w, h, alt }` in the JSON.
- `legacy/` holds the previous design and is not part of the build.
