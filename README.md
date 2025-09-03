# Fullstack Engineer Portfolio (Vue.js, Book-Style UI)

A creative, professional portfolio with a book-like page flip experience. Built with Vue 3, TailwindCSS, and GSAP.

## Scripts

- dev: start Vite dev server
- build: production build
- preview: preview the production build
- deploy: deploy dist to gh-pages branch (manual alternative to GitHub Actions)

## Setup

1. Install dependencies
2. Run development server
3. Build and deploy

See commands at the end of this file.

## Structure

- src/components/Book.vue — core 3D page flip component using GSAP
- src/pages/\* — Cover, About, Skills, Projects, Experience, Contact
- tailwind.config.js/postcss.config.js — styling setup
- .github/workflows/deploy.yml — auto deploy to GitHub Pages

## Customize

- Update page content in `src/pages/*`
- Replace colors/fonts in `tailwind.config.js`
- Swap screenshots/links in `ProjectsPage.vue`
- Add analytics/SEO tags in `index.html`

## Try it

```sh
# install
npm install

# dev
npm run dev

# build
npm run build

# preview
npm run preview

# deploy to gh-pages (needs repo origin and permissions)
npm run deploy
```

## Notes

- For GitHub Pages via Actions, set default branch to `main` and Pages source to `GitHub Actions`.
- The `base` path is auto-set for GH Actions builds.
