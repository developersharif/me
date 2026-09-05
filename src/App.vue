<template>
  <a class="skip mono" href="#about">Skip to content</a>

  <IntroCurtain :name="data.site.name" :role="data.hero.eyebrow" @done="onIntroDone" />
  <SignalCursor />
  <SiteNav :items="data.nav" :email="data.contact.email" :social="data.contact.links.slice(0, 4)" />

  <main id="main" ref="mainEl">
    <HeroSection :data="data.hero" :site="data.site" />
    <AboutSection :data="data.about" :index="no('about')" />
    <SkillsSection :data="data.skills" :index="no('skills')" />
    <WorkSection :data="data.work" :index="no('work')" />
    <ExperienceSection :data="data.experience" :index="no('experience')" />
    <WritingSection :data="data.writing" :index="no('writing')" />
    <ContactSection :data="data.contact" :index="no('contact')" />
  </main>

  <SiteFooter :site="data.site" />
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import raw from './data/portfolio.json';
import type { PortfolioData } from './types';
import { site } from './composables/useSiteState';
import { initSmoothScroll, destroySmoothScroll, scrollToTarget } from './composables/useSmoothScroll';
import { applyTheme, setupChapterThemes } from './composables/useChapterTheme';

import IntroCurtain from './components/IntroCurtain.vue';
import SignalCursor from './components/SignalCursor.vue';
import SiteNav from './components/SiteNav.vue';
import SiteFooter from './components/SiteFooter.vue';
import HeroSection from './sections/HeroSection.vue';
import AboutSection from './sections/AboutSection.vue';
import SkillsSection from './sections/SkillsSection.vue';
import WorkSection from './sections/WorkSection.vue';
import ExperienceSection from './sections/ExperienceSection.vue';
import WritingSection from './sections/WritingSection.vue';
import ContactSection from './sections/ContactSection.vue';

const data = raw as unknown as PortfolioData;
const mainEl = ref<HTMLElement | null>(null);

const no = (id: string) => String(data.nav.findIndex((n) => n.id === id) + 1).padStart(2, '0');

let cleanupThemes: (() => void) | undefined;
let sectionTriggers: ScrollTrigger[] = [];

function trackSections() {
  const sections = Array.from(mainEl.value?.querySelectorAll<HTMLElement>('section[id]') ?? []);
  sectionTriggers = sections.map((sec) =>
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (!self.isActive) return;
        site.activeSection = sec.id;
        const url = sec.id === 'hero' ? location.pathname + location.search : '#' + sec.id;
        history.replaceState(null, '', url);
      },
    })
  );
}

function onIntroDone() {
  site.introDone = true;
  const hash = location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    nextTick(() => {
      scrollToTarget('#' + hash, { immediate: true });
      ScrollTrigger.refresh();
    });
  }
}

onMounted(async () => {
  // Under the intro curtain the page is already paper; the curtain lifts onto it.
  applyTheme('paper', { immediate: true });
  initSmoothScroll();
  await nextTick();
  if (mainEl.value) cleanupThemes = setupChapterThemes(mainEl.value);
  trackSections();
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  fonts?.ready.then(() => ScrollTrigger.refresh());
  site.ready = true;
});

onBeforeUnmount(() => {
  cleanupThemes?.();
  sectionTriggers.forEach((t) => t.kill());
  destroySmoothScroll();
});
</script>

<style>
.skip {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 300;
  padding: 10px 14px;
  background: var(--ink);
  color: var(--paper);
  border-radius: 4px;
  transform: translateY(-200%);
  transition: transform 0.3s var(--ease-out);
}

.skip:focus-visible {
  transform: none;
}
</style>
