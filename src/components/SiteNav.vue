<template>
  <header class="nav" :class="{ 'nav--open': site.menuOpen }">
    <div class="nav__progress" aria-hidden="true"><span ref="bar"></span></div>
    <div class="nav__bar container">
      <a href="#hero" class="nav__brand" aria-label="Back to top" @click.prevent="go('hero')">
        <span class="display">S<em>.</em></span>
      </a>

      <p class="nav__chapter mono" aria-live="polite">
        <span class="nav__index">{{ chapter.index }}</span>
        <span class="nav__sep" aria-hidden="true"></span>
        <span class="nav__label">{{ chapter.label }}</span>
      </p>

      <button
        class="nav__toggle mono"
        type="button"
        :aria-expanded="site.menuOpen"
        aria-controls="site-menu"
        @click="toggle"
      >
        <span class="nav__toggle-text">{{ site.menuOpen ? 'Close' : 'Menu' }}</span>
        <span class="nav__burger" aria-hidden="true"><i></i><i></i></span>
      </button>
    </div>
  </header>

  <div
    id="site-menu"
    ref="menuEl"
    class="menu"
    :aria-hidden="!site.menuOpen"
    :inert="site.menuOpen ? null : ''"
  >
    <nav class="menu__inner container" aria-label="Site sections">
      <ol class="menu__list">
        <li v-for="(item, i) in items" :key="item.id" class="menu__item">
          <a
            :href="'#' + item.id"
            class="menu__link"
            :class="{ 'is-active': site.activeSection === item.id }"
            @click.prevent="go(item.id)"
          >
            <span class="menu__num mono">{{ pad(i + 1) }}</span>
            <span class="menu__label display">{{ item.label }}</span>
          </a>
        </li>
      </ol>
      <div class="menu__foot">
        <a class="menu__mail link-ul" :href="'mailto:' + email">{{ email }}</a>
        <ul class="menu__social mono">
          <li v-for="l in social" :key="l.href">
            <a :href="l.href" target="_blank" rel="noopener noreferrer" class="link-ul">{{ l.label }}</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { NavItem } from '../types';
import { site, prefersReducedMotion } from '../composables/useSiteState';
import { lockScroll, scrollToTarget } from '../composables/useSmoothScroll';

const props = defineProps<{
  items: NavItem[];
  email: string;
  social: { label: string; href: string }[];
}>();

const bar = ref<HTMLElement | null>(null);
const menuEl = ref<HTMLElement | null>(null);

const pad = (n: number) => String(n).padStart(2, '0');

const chapter = computed(() => {
  const i = props.items.findIndex((it) => it.id === site.activeSection);
  if (i < 0) return { index: '00', label: 'Intro' };
  return { index: pad(i + 1), label: props.items[i].label };
});

let progressTrigger: ScrollTrigger | undefined;
let menuTl: gsap.core.Timeline | undefined;

function buildMenuTimeline() {
  const menu = menuEl.value;
  if (!menu) return;
  const links = menu.querySelectorAll<HTMLElement>('.menu__link');
  const foot = menu.querySelector<HTMLElement>('.menu__foot');
  const reduce = prefersReducedMotion();
  menuTl = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } });
  menuTl
    .set(menu, { visibility: 'visible' })
    .fromTo(
      menu,
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: reduce ? 0 : 0.85, ease: 'power4.inOut' }
    )
    .fromTo(
      links,
      { yPercent: 110 },
      { yPercent: 0, duration: reduce ? 0 : 0.9, stagger: reduce ? 0 : 0.06, ease: 'power4.out' },
      reduce ? 0 : '-=0.35'
    )
    .fromTo(
      foot,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: reduce ? 0 : 0.5 },
      reduce ? 0 : '-=0.5'
    );
  menuTl.eventCallback('onReverseComplete', () => gsap.set(menu, { visibility: 'hidden' }));
}

function toggle() {
  site.menuOpen = !site.menuOpen;
}

function go(id: string) {
  const wasOpen = site.menuOpen;
  site.menuOpen = false;
  const target = id === 'hero' ? 0 : `#${id}`;
  // Let the menu start closing before the page moves under it.
  window.setTimeout(() => scrollToTarget(target, { offset: 0 }), wasOpen ? 120 : 0);
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && site.menuOpen) site.menuOpen = false;
}

watch(
  () => site.menuOpen,
  (open) => {
    lockScroll(open);
    if (!menuTl) buildMenuTimeline();
    if (open) menuTl?.timeScale(1).play();
    else menuTl?.timeScale(1.6).reverse();
  }
);

onMounted(() => {
  buildMenuTimeline();
  if (bar.value) {
    progressTrigger = gsap.fromTo(
      bar.value,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } }
    ).scrollTrigger;
  }
  window.addEventListener('keydown', onKey);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey);
  progressTrigger?.kill();
  menuTl?.kill();
});
</script>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 60;
  color: var(--fg);
  pointer-events: none;
  background: linear-gradient(to bottom, var(--bg) 0%, transparent 100%);
}

.nav--open {
  color: var(--ink);
  background: none;
}

.nav__progress {
  position: absolute;
  inset: 0 0 auto 0;
  height: 2px;
  background: transparent;
}

.nav__progress span {
  display: block;
  height: 100%;
  background: var(--accent);
  transform-origin: 0 50%;
  transform: scaleX(0);
}

.nav--open .nav__progress {
  opacity: 0;
}

.nav__bar {
  height: var(--nav-h);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
}

.nav__bar > * {
  pointer-events: auto;
}

.nav__brand {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-size: 1.85rem;
  line-height: 1;
}

.nav__brand em {
  color: var(--accent);
  font-style: italic;
}

.nav--open .nav__brand em {
  color: var(--ink);
}

.nav__chapter {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
}

.nav__index {
  color: var(--accent-text);
}

.nav--open .nav__index {
  color: var(--ink);
}

.nav__sep {
  width: 28px;
  height: 1px;
  background: currentColor;
  opacity: 0.5;
}

.nav__toggle {
  justify-self: end;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 0 4px;
}

.nav__burger {
  position: relative;
  width: 22px;
  height: 12px;
}

.nav__burger i {
  position: absolute;
  left: 0;
  right: 0;
  height: 1.5px;
  background: currentColor;
  transition: transform 0.5s var(--ease-inout), top 0.5s var(--ease-inout);
}

.nav__burger i:first-child { top: 0; }
.nav__burger i:last-child { top: 10.5px; }

.nav--open .nav__burger i:first-child { top: 5px; transform: rotate(45deg); }
.nav--open .nav__burger i:last-child { top: 5px; transform: rotate(-45deg); }

/* Overlay menu ------------------------------------------------------ */
.menu {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: var(--vermilion);
  color: var(--ink);
  visibility: hidden;
  clip-path: inset(0 0 100% 0);
  overflow: hidden;
}

.menu__inner {
  height: 100%;
  padding-top: calc(var(--nav-h) + 4vh);
  padding-bottom: max(24px, env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
}

.menu__list {
  display: flex;
  flex-direction: column;
}

.menu__item {
  overflow: hidden;
  border-top: 1px solid rgba(15, 14, 12, 0.22);
}

.menu__item:last-child {
  border-bottom: 1px solid rgba(15, 14, 12, 0.22);
}

.menu__link {
  display: flex;
  align-items: baseline;
  gap: clamp(14px, 3vw, 40px);
  padding: clamp(8px, 1.6vh, 18px) 0;
  transition: transform 0.5s var(--ease-out);
}

.menu__num {
  width: 2.4em;
  opacity: 0.7;
}

.menu__label {
  font-size: clamp(2.4rem, 8.5vh, 6rem);
  line-height: 1;
  transition: transform 0.5s var(--ease-out), font-variation-settings 0.5s ease;
}

.menu__link:hover .menu__label,
.menu__link:focus-visible .menu__label,
.menu__link.is-active .menu__label {
  font-style: italic;
  transform: translateX(0.15em);
}

.menu__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px 32px;
}

.menu__mail {
  font-family: var(--font-display);
  font-variation-settings: 'opsz' 28, 'SOFT' 60;
  font-size: clamp(1.1rem, 2vw, 1.5rem);
}

.menu__social {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
}

@media (max-width: 767px) {
  .nav__chapter { display: none; }
  .nav__bar { grid-template-columns: 1fr auto; }
  .menu__label { font-size: clamp(2.2rem, 7.5vh, 4rem); }
}
</style>
