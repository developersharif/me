<template>
  <div class="h-screen w-full max-w-full overflow-hidden flex flex-col">
    <header class="px-6 py-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
      <div class="font-mono text-sm text-accent-300">{{ data.site.title }}</div>
      <nav class="hidden sm:flex gap-4 text-sm">
  <button v-for="(link, i) in navLinks" :key="link.to" class="hover:text-accent-300 transition-colors" @click="goTo(i, 'fast')">
          {{ link.label }}
        </button>
      </nav>
    </header>

    <main class="flex-1 overflow-hidden">
      <Book :pages="pages" ref="bookRef" />
    </main>

    <footer class="px-6 py-4 text-center text-xs text-white/50 border-t border-white/10 flex-shrink-0">
      © <span>{{ new Date().getFullYear() }}</span> {{ data.site.footerName }}. Built with Vue 3, Tailwind, GSAP.
    </footer>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Book from './components/Book.vue';

import CoverPage from './pages/CoverPage.vue';
import AboutPage from './pages/AboutPage.vue';
import SkillsPage from './pages/SkillsPage.vue';
import ProjectsPage from './pages/ProjectsPage.vue';
import ExperiencePage from './pages/ExperiencePage.vue';
import ContactPage from './pages/ContactPage.vue';
import dataJson from './data/portfolio.json';
const data: any = dataJson as any;
import { useTheme } from './composables/useTheme';

const componentMap: Record<string, any> = {
  cover: CoverPage,
  about: AboutPage,
  skills: SkillsPage,
  projects: ProjectsPage,
  experience: ExperiencePage,
  contact: ContactPage
};

const pagePropsMap: Record<string, any> = {
  cover: { data: data.cover },
  about: { data: data.about },
  skills: { data: data.skills },
  projects: { data: data.projects },
  experience: { data: data.experience },
  contact: { data: data.contact }
};

const pages = data.pages.map(p => ({
  id: p.id,
  label: p.label,
  component: componentMap[p.id],
  props: pagePropsMap[p.id] || {}
}));

const navLinks = computed(() => pages.map(p => ({ to: p.id, label: p.label })));
const bookRef = ref<InstanceType<typeof Book> | null>(null);

function goTo(index: number, mode: 'step' | 'fast' | 'instant' = 'fast') {
  bookRef.value?.goTo(index, { mode });
}

onMounted(() => {
  useTheme();
});
</script>

<style scoped>
</style>
