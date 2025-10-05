# Copilot Instructions - Vue.js Portfolio (Book-Style UI)

## Project Overview

This is an interactive portfolio website styled as a 3D book with page-flip animations. Built with Vue 3 (Composition API), GSAP for animations, TailwindCSS, and deployed to GitHub Pages. The core metaphor is a "digital codex" - each portfolio section is a book page with realistic page-turn physics.

## Architecture

### Data-Driven Page System

All portfolio content lives in `src/data/portfolio.json` as a single source of truth. The `App.vue` maps page IDs to Vue components and props:

```typescript
const componentMap = { cover: CoverPage, about: AboutPage, skills: SkillsPage, ... };
const pages = data.pages.map(p => ({ id: p.id, component: componentMap[p.id], props: ... }));
```

**To add a new page:** (1) Create component in `src/pages/`, (2) Add to `componentMap` in `App.vue`, (3) Define data in `portfolio.json` under relevant key, (4) Add to `pages` array in JSON.

### Book Component (`src/components/Book.vue`)

The 1666-line core component managing page navigation and animations. Key architecture:

- **Mobile-first layout:** Single scrollable page with spiral binding UI (`notebook-spiral`, `page-holes`)
- **GSAP-powered page flips:** Uses `gsap.timeline()` for physics-based page turns with shadows, gloss effects, and edge highlights
- **Responsive page container:** Mobile uses `.mobile-page-container`, desktop uses `.desktop-pages-container` (both render single-page layout, not spread)
- **Scroll-to-next indicator:** Shows when user scrolls 95% down and there's a next page (auto-advance deliberately disabled for user control)
- **Side navigation:** Fixed prev/next buttons (`.side-btn`) hidden when not applicable

**Animation modes:**

- `fast` - default 0.8s smooth turn
- `instant` - immediate page change
- `step` - not fully implemented

### Theme System (`src/composables/useTheme.ts`)

Reads `src/data/theme.json` and applies CSS custom properties to `:root`. Supports runtime theme customization:

```typescript
useTheme({ colors: { accent: "#8b5cf6" } }); // Override specific values
```

**Key customizable properties:** `--color-accent`, `--bg-from/via/to` (gradients), `--radius-container`, `--blur-bg`

### Sound System (`src/composables/useMagicSound.ts`)

Web Audio API-based gamified audio feedback with localStorage persistence. Key functions:

- `playMagicalChord(frequency, duration, intensity)` - Harmonic chord synthesis
- `playMagicPulse(magicLevel)` - Intensity-based pulse effects
- `playPageTurn(intensity)` - Swoosh sound for page transitions
  Browser autoplay policies require user interaction to initialize AudioContext.

## Development Workflows

### Local Development

```bash
npm run dev       # Starts Vite dev server on :5173
npm run build     # Production build to dist/
npm run preview   # Preview production build on :4173
```

### Deployment

**Automatic:** GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on push to `main`. Sets `base: '/me/'` for repo-relative paths.

**Manual:** `npm run deploy` uses `gh-pages` package to push `dist/` to `gh-pages` branch.

**Critical config:** `vite.config.ts` conditionally sets `base` path:

```typescript
base: process.env.GITHUB_ACTIONS ? "/me/" : "/";
```

### Asset Handling

Public assets in `public/assets/images/` are referenced in `portfolio.json` as relative paths. The `resolveAsset()` helper in pages prepends Vite's base URL.

## Code Conventions

### Vue Patterns

- **Composition API with `<script setup>`:** All components use TypeScript setup syntax
- **Props typing:** `defineProps<{ data?: PageData }>()` - optional props with specific interfaces
- **No emits for internal state:** Book component uses ref manipulation, not events for page changes
- **Component imports:** Direct imports, no global registration

### TypeScript Usage

- **Selective `@ts-nocheck`:** Used in `App.vue` for rapid prototyping with data mapping
- **Type definitions:** Inline interfaces in components (e.g., `CoverData`, `SkillsData`)
- **Path alias:** `@/` resolves to `src/` (configured in `tsconfig.json` and `vite.config.ts`)

### Styling Conventions

- **Tailwind utility classes:** Primary styling method with extensive use of responsive variants (`md:`, `sm:`)
- **Component-scoped CSS:** Complex animations and book-specific styles in `<style scoped>` blocks
- **Global styles:** `src/styles/main.css` (Tailwind base) and `src/styles/cover.css` (cover page effects)
- **CSS custom properties:** Theme values exposed as `--color-accent`, etc. for dynamic theming

### Animation Patterns

GSAP timelines are the standard for complex animations:

```typescript
const tl = gsap.timeline({
  onComplete: () => {
    /* cleanup */
  },
});
tl.to(element, { rotateY: -180, duration: 0.8, ease: "power2.inOut" });
tl.fromTo(element, { opacity: 0 }, { opacity: 1 }, "<50%"); // Overlap by 50%
```

**Performance notes:**

- Hardware acceleration via transform properties (translate3d, rotateY)
- `will-change` used sparingly (applied/removed in animation lifecycle)
- Drag-to-flip deliberately disabled to prevent mobile scroll conflicts

## Testing

Test infrastructure placeholder exists (`src/components/__tests__/Book.spec.ts`) but no test runner configured. Tests would require Vitest setup per Vue 3 + Vite standards.

## Common Pitfalls

1. **Page navigation bugs:** Ensure `currentPageIndex` state is updated before animations complete to prevent double-triggers
2. **Mobile scroll issues:** Never block scroll events on `.mobile-page` or `.page-content` - scroll is primary navigation within pages
3. **Asset 404s on deployment:** Always use `resolveAsset()` helper or Vite's `import.meta.env.BASE_URL` for public asset paths
4. **Sound doesn't play:** AudioContext requires user interaction to initialize - `initializeAudioContext()` is called on first enable
5. **Theme not applied:** `useTheme()` must be called in `onMounted()` hook (see `App.vue`)

## Key Files Reference

- **Core architecture:** `src/App.vue`, `src/components/Book.vue`
- **Content source:** `src/data/portfolio.json`
- **Page templates:** `src/pages/*.vue` (CoverPage, AboutPage, SkillsPage, etc.)
- **Composables:** `src/composables/useTheme.ts`, `useMagicSound.ts`
- **Build config:** `vite.config.ts`, `tailwind.config.js`
- **Deployment:** `.github/workflows/deploy.yml`
