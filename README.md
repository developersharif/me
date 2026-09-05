# Sharif — Portfolio

A single-page portfolio built as one continuous surface: the page background
tweens between paper, vermilion and ink as you move through the chapters, a live
"signal" line reacts to the pointer and scroll, and the work strip scrolls
horizontally on desktop. Vue 3 + GSAP (ScrollTrigger, SplitText) + Lenis.

Live: https://developersharif.github.io/me/

## Scripts

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/ (base: /me/)
npm run preview   # serve dist/ on :4173
npm run deploy    # push dist/ to gh-pages (GitHub Actions also deploys on push to main)
```

## Structure

```
src/
  App.vue                  shell: intro, nav, cursor, sections, footer
  main.ts                  registers GSAP plugins + directives
  data/portfolio.json      single source of truth for all copy and links
  types.ts                 data model for portfolio.json
  sections/                Hero, About, Skills, Work, Experience, Writing, Contact
  components/              SiteNav, IntroCurtain, SignalCursor, Oscilloscope,
                           WorkPlate, SignalBars, Marquee, SiteFooter
  composables/
    useSmoothScroll.ts     Lenis + ScrollTrigger sync, scrollTo, scroll lock
    useChapterTheme.ts     tweens root tokens (--bg/--fg/...) per [data-theme] chapter
    useSiteState.ts        active section, menu, intro flags, media-query helpers
    useAssets.ts           base-URL-safe asset paths, WebP srcsets
  directives/
    reveal.ts              v-reveal: rise-in on first viewport entry
    split.ts               v-split: masked line reveal for headings (SplitText)
  styles/main.css          tokens, base, type system, shared utilities
public/assets/work/        responsive WebP plates (800 / 1600) used by the UI
legacy/                    the previous "codex" design, kept for reference
```

## Editing content

Everything visible comes from `src/data/portfolio.json`:

- `hero`, `about`, `skills`, `work`, `experience`, `writing`, `contact`
- Skill `level` is one of `master | adept | familiar | novice` (4 → 1 bars).
- Featured work uses `image: { slug, w, h, alt }` mapping to
  `public/assets/work/<slug>-800.webp` and `<slug>-1600.webp`, or a
  `plate: { type: "terminal", lines: [...] }` for projects without a screenshot.
- Set `contact.cv` to a path (e.g. `/cv.pdf` in `public/`) to show the CV button.

## Motion notes

- Reduced motion is respected everywhere: no element is hidden unless it will
  animate, Lenis falls back to native scrolling, and the intro is skipped.
- Desktop uses Lenis for weighted wheel scrolling; touch stays native.
- The horizontal work strip only pins at ≥1024px; below that it stacks.
