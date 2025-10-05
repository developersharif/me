<template>
  <div class="h-screen w-full max-w-full overflow-hidden flex flex-col relative z-10">
    <!-- Calm background for desktop and tablet only -->
    <CalmBackground />
    
    <header
      class="sticky top-0 z-50 px-6 py-3 sm:py-4 flex items-center justify-between border-b border-white/10 flex-shrink-0
             bg-black/50 backdrop-blur-md text-white shadow-lg"
    >
      <div class="font-mono text-sm text-accent-300 hidden sm:block">{{ data.site.title }}</div>
      <nav class="flex gap-3 sm:gap-4 text-xs sm:text-sm overflow-x-auto whitespace-nowrap text-white/90">
        <button 
          v-for="(link, i) in navLinks" 
          :key="link.to" 
          class="nav-link relative hover:text-accent-300 transition-colors" 
          :class="{ 'active': currentPageIndex === i }"
          @click="goTo(i, 'fast')"
        >
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
// @ts-nocheck
import { ref, computed, onMounted } from 'vue';
import Book from './components/Book.vue';
import CalmBackground from './components/CalmBackground.vue';

import CoverPage from './pages/CoverPage.vue';
import AboutPage from './pages/AboutPage.vue';
import SkillsPage from './pages/SkillsPage.vue';
import ProjectsPage from './pages/ProjectsPage.vue';
import ExperiencePage from './pages/ExperiencePage.vue';
import ContactPage from './pages/ContactPage.vue';
import ArticlesPage from './pages/ArticlesPage.vue';
import dataJson from './data/portfolio.json';
const data: any = dataJson as any;
import { useTheme } from './composables/useTheme';

const componentMap: Record<string, any> = {
  cover: CoverPage,
  about: AboutPage,
  skills: SkillsPage,
  projects: ProjectsPage,
  experience: ExperiencePage,
  contact: ContactPage,
  articles: ArticlesPage
};

const pagePropsMap: Record<string, any> = {
  cover: { data: data.cover },
  about: { data: data.about },
  skills: { data: data.skills },
  projects: { data: data.projects },
  experience: { data: data.experience },
  contact: { data: data.contact },
  articles: { data: { medium: data.contact?.medium } }
};

const pages = data.pages.map(p => ({
  id: p.id,
  label: p.label,
  component: componentMap[p.id],
  props: pagePropsMap[p.id] || {}
}));

const navLinks = computed(() => pages.map(p => ({ to: p.id, label: p.label })));
const bookRef = ref<InstanceType<typeof Book> | null>(null);
const currentPageIndex = computed(() => bookRef.value?.currentPageIndex ?? 0);

function goTo(index: number, mode: 'step' | 'fast' | 'instant' = 'fast') {
  bookRef.value?.goTo(index, { mode });
}

onMounted(() => {
  useTheme();
});
</script>

<style scoped>
.nav-link {
  position: relative;
  padding-bottom: 6px;
  transition: all 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(135deg, #10b981, #06d6a0);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

.nav-link.active {
  color: #10b981;
  font-weight: 600;
}

.nav-link.active::after {
  transform: scaleX(1);
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
  }
  50% {
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.9);
  }
}
</style>
