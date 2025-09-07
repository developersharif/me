<template>
  <section class="h-full flex flex-col gap-6 overflow-hidden">
    <!-- Header -->
    <header class="flex items-start justify-between flex-shrink-0">
      <div>
        <p class="text-[10px] uppercase tracking-[0.25em] text-white/50">About</p>
        <h2 class="text-3xl md:text-4xl font-bold text-white">{{ data.header.title }}</h2>
        <p class="text-white/60 mt-1 text-sm md:text-base" v-html="data.header.subtitle"></p>
      </div>
      <img src="/avatar.svg" alt="Avatar" class="hidden sm:block w-12 h-12 rounded-full ring-1 ring-white/10" />
    </header>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
        <!-- Summary -->
        <article v-if="data.sections[0]" class="lg:col-span-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
          <h3 class="text-lg md:text-xl font-semibold text-white mb-2">{{ data.sections[0].title }}</h3>
          <p class="text-white/80 leading-relaxed" v-html="data.sections[0].body"></p>
        </article>

        <!-- Highlights -->
        <aside v-if="data.sections[1]" class="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
          <h3 class="text-lg md:text-xl font-semibold text-white mb-3">{{ data.sections[1].title }}</h3>
          <ul class="space-y-3">
            <li v-for="b in data.sections[1].bullets" :key="b.text" class="flex items-start gap-3">
              <span class="mt-[2px]">
                <AppIcon :name="b.icon" :size="18" :stroke-width="2" tw="text-emerald-400" />
              </span>
              <span class="text-white/85">{{ b.text }}</span>
            </li>
          </ul>
        </aside>

        <!-- Focus & Interests -->
        <section v-if="data.sections[2]" class="lg:col-span-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg md:text-xl font-semibold text-white">{{ data.sections[2].title }}</h3>
            <div v-if="yearsExp" class="text-xs text-white/60">~ {{ yearsExp }} years in the craft</div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="space-y-2">
              <div class="text-white/90 font-medium">Research Areas</div>
              <ul class="space-y-1 text-white/70 pl-4 list-disc marker:text-white/40">
                <li v-for="t in data.sections[2].research" :key="t">{{ t }}</li>
              </ul>
            </div>
            <div class="space-y-2">
              <div class="text-white/90 font-medium">Learning Path</div>
              <ul class="space-y-1 text-white/70 pl-4 list-disc marker:text-white/40">
                <li v-for="t in data.sections[2].learning" :key="t">{{ t }}</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Timeline -->
        <section class="lg:col-span-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg md:text-xl font-semibold text-white">Timeline</h3>
            <span v-if="firstYear" class="text-xs text-white/50">Since {{ firstYear }}</span>
          </div>
          <ol class="relative pl-6">
            <div class="absolute left-2 top-1 bottom-1 w-px bg-white/10"></div>
            <li v-for="(t, idx) in data.timeline" :key="t.title" class="relative group py-2">
              <span class="absolute -left-[2px] top-3 inline-block w-2 h-2 rounded-full"
                    :class="[ idx === 0 ? 'bg-emerald-400' : idx === data.timeline.length-1 ? 'bg-purple-400' : 'bg-blue-400', 'ring-2 ring-white/20']" />
              <div class="flex flex-wrap items-baseline gap-x-3">
                <span class="text-white/70 text-xs font-mono">{{ t.year }}</span>
                <h4 class="text-white font-medium">{{ t.title }}</h4>
              </div>
              <p class="text-white/60 text-sm mt-1">{{ t.desc }}</p>
            </li>
          </ol>
        </section>
      </div>
    </div>
  </section>
  
</template>

<script setup lang="ts">
import AppIcon from '../components/AppIcon.vue';
interface AboutData {
  header: { title: string; subtitle: string };
  sections: any[];
  timeline: { year: string; title: string; desc: string }[];
}

const props = defineProps<{ data?: AboutData }>();
const data = props.data ?? { header: { title: 'Chapter I: The Chronicle', subtitle: '' }, sections: [], timeline: [] };

// Derived helpers for subtle metrics
const firstYear = (() => {
  if (!data.timeline?.length) return '';
  const y = parseInt(data.timeline[0].year, 10);
  return Number.isFinite(y) ? String(y) : '';
})();

const yearsExp = (() => {
  if (!firstYear) return 0;
  const y = parseInt(firstYear, 10);
  const now = new Date().getFullYear();
  const diff = now - y;
  return diff > 0 ? diff : 0;
})();
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(147, 51, 234, 0.7);
}

/* Link styles for HTML content */
:deep(a) {
  color: #10b981; /* emerald-500 */
  text-decoration: underline;
  text-decoration-color: rgba(16, 185, 129, 0.4);
  text-underline-offset: 2px;
  transition: all 0.2s ease;
}

:deep(a:hover) {
  color: #06d6a0; /* brighter emerald */
  text-decoration-color: rgba(16, 185, 129, 0.8);
  text-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
}

:deep(a:visited) {
  color: #8b5cf6; /* purple-500 */
  text-decoration-color: rgba(139, 92, 246, 0.4);
}

:deep(a:visited:hover) {
  color: #a78bfa; /* purple-400 */
  text-decoration-color: rgba(139, 92, 246, 0.8);
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
}
</style>
