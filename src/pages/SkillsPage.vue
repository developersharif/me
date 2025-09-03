<template>
  <section class="h-full flex flex-col gap-6 relative overflow-hidden">
    <!-- Chapter header -->
    <div class="flex items-center gap-4 mb-4 flex-shrink-0">
      <div class="text-3xl">📚</div>
      <div>
        <h2 class="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Chapter II: The Grimoire
        </h2>
        <p class="text-white/60 text-sm font-mono">Schools of magical programming arts</p>
      </div>
    </div>
    
    <!-- Skills organized by "schools of magic" -->
    <div class="flex-1 space-y-6 overflow-y-auto overflow-x-hidden">
      <div v-for="group in data.groups" :key="group.title" class="skill-school">
        <div class="school-header">
          <span class="school-icon">{{ group.icon }}</span>
          <h3 class="school-title">{{ group.title }}</h3>
          <div class="school-subtitle">{{ group.subtitle }}</div>
        </div>
        <div class="skills-grid">
          <div v-for="skill in group.skills" :key="skill.name" 
               :class="[
                 'skill-rune group cursor-pointer',
                 skillColors[skill.color]
               ]">
            <div class="skill-rune-inner">
              <div class="skill-name">{{ skill.name }}</div>
              <div :class="[
                'skill-level bg-gradient-to-r',
                levelColors[skill.level]
              ]">
                {{ skill.level }}
              </div>
            </div>
            <div class="skill-tooltip">
              {{ skill.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface SkillsData {
  groups: Array<{
    icon: string; title: string; subtitle: string;
    skills: Array<{ name: string; level: 'novice'|'adept'|'master'; color: string; description: string }>
  }>;
}

const props = defineProps<{ data?: SkillsData }>();
const data = props.data ?? { groups: [] };

const levelColors = {
  novice: 'from-gray-400 to-gray-600',
  adept: 'from-blue-400 to-purple-500',
  master: 'from-yellow-400 to-orange-500'
};

const skillColors: Record<string, string> = {
  emerald: 'border-emerald-500/30 hover:border-emerald-400/60',
  blue: 'border-blue-500/30 hover:border-blue-400/60',
  purple: 'border-purple-500/30 hover:border-purple-400/60',
  green: 'border-green-500/30 hover:border-green-400/60',
  cyan: 'border-cyan-500/30 hover:border-cyan-400/60',
  yellow: 'border-yellow-500/30 hover:border-yellow-400/60',
  gray: 'border-gray-500/30 hover:border-gray-400/60',
  indigo: 'border-indigo-500/30 hover:border-indigo-400/60',
  pink: 'border-pink-500/30 hover:border-pink-400/60',
  red: 'border-red-500/30 hover:border-red-400/60',
  orange: 'border-orange-500/30 hover:border-orange-400/60',
  violet: 'border-violet-500/30 hover:border-violet-400/60',
};
</script>

<style scoped>
.skill-school {
  @apply bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6;
}

.school-header {
  @apply flex items-center gap-3 mb-4;
}

.school-icon {
  @apply text-2xl;
}

.school-title {
  @apply text-xl font-semibold text-white;
}

.school-subtitle {
  @apply text-white/60 text-sm ml-auto font-mono;
}

.skills-grid {
  @apply grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3;
}

.skill-rune {
  @apply relative p-4 rounded-lg bg-white/5 border transition-all duration-300 hover:bg-white/10 hover:scale-105 transform;
}

.skill-rune-inner {
  @apply space-y-2;
}

.skill-name {
  @apply text-sm font-medium text-white;
}

.skill-level {
  @apply text-xs px-2 py-1 rounded-full text-white font-bold uppercase tracking-wide text-center;
}

.skill-tooltip {
  @apply absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10;
}

.skill-tooltip::before {
  @apply absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900;
  content: '';
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: var(--color-glass-bg);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: var(--indicator-from);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: var(--indicator-to);
}
</style>
