<template>
  <section class="h-full flex flex-col gap-6 relative overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-2 flex-shrink-0">
      <div class="text-2xl" aria-hidden="true">◆</div>
      <div>
        <h2 class="text-2xl font-bold">Skills & Competencies</h2>
        <p class="text-white/60 text-sm">A concise view of strengths across the stack</p>
      </div>
    </div>

    <!-- Legend (simplified) -->
    <div class="legend">
      <span class="legend-item"><AppIcon name="award" :size="14" /> Master</span>
      <span class="legend-item"><AppIcon name="badgecheck" :size="14" /> Adept</span>
      <span class="legend-item"><AppIcon name="circle" :size="12" /> Familiar</span>
    </div>

    <!-- Groups -->
    <div class="flex-1 space-y-6 overflow-y-auto overflow-x-hidden">
      <div v-for="group in groups" :key="group.title" class="group-card">
        <div class="group-header">
          <div class="group-titles">
            <h3 class="group-title">{{ group.title }}</h3>
            <div class="group-subtitle">{{ group.subtitle }}</div>
          </div>
        </div>

        <div class="skills-list" role="list">
          <div v-for="skill in group.skills" :key="skill.name" class="skill-card" role="listitem">
            <div class="skill-header">
              <div class="skill-title">
                <span class="skill-dot" :class="dotClass(skill.level)"></span>
                <span class="name">{{ skill.name }}</span>
              </div>
              <span class="level-chip" :data-level="skill.level">
                <AppIcon :name="levelIcon(skill.level)" :size="14" />
                {{ prettyLevel(skill.level) }}
              </span>
            </div>
            <div v-if="skill.description" class="skill-desc">{{ skill.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
  
</template>

<script setup lang="ts">
import AppIcon from '../components/AppIcon.vue';
interface Skill { name: string; level: 'novice'|'adept'|'master'; color: string; description?: string }
interface SkillsGroup { icon: string; title: string; subtitle: string; skills: Skill[] }
interface SkillsData { groups: SkillsGroup[] }

const props = defineProps<{ data?: SkillsData }>();
const data = props.data ?? { groups: [] };

const LEVEL_ORDER: Record<Skill['level'], number> = { master: 3, adept: 2, novice: 1 };
// keep order only; no percent UI

const groups = (data.groups || []).map(g => ({
  ...g,
  skills: [...g.skills].sort((a, b) => LEVEL_ORDER[b.level] - LEVEL_ORDER[a.level] || a.name.localeCompare(b.name))
}));

function prettyLevel(level: Skill['level']) { return level.charAt(0).toUpperCase() + level.slice(1); }
function levelIcon(level: Skill['level']) { return level === 'master' ? 'award' : level === 'adept' ? 'badgecheck' : 'circle'; }
function dotClass(level: Skill['level']) { return level === 'master' ? 'd-master' : level === 'adept' ? 'd-adept' : 'd-novice'; }

const COLOR_KEYS = new Set(['emerald','blue','purple','green','cyan','yellow','gray','indigo','pink','red','orange','violet']);
function colorClass(c: string) { return COLOR_KEYS.has(c) ? `c-${c}` : 'c-gray'; }
</script>

<style scoped>
/* Containers */
.group-card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 1rem 1.25rem;
}
.group-header { display: flex; align-items: baseline; justify-content: space-between; gap: .75rem; margin-bottom: .75rem; }
.group-title { color: #fff; font-weight: 700; font-size: 1.1rem; }
.group-subtitle { color: rgba(255,255,255,.65); font-size: .85rem; }

.legend { display: flex; gap: .75rem; align-items: center; color: rgba(255,255,255,.7); font-size: .8rem; }
.legend-item { display: inline-flex; align-items: center; gap: .45rem; }

/* New skill card */
.skills-list { display: grid; grid-template-columns: 1fr; gap: .6rem; }
@media (min-width: 640px) { .skills-list { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .skills-list { grid-template-columns: 1fr 1fr; } }

.skill-card {
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: .85rem .9rem;
  background: rgba(255,255,255,0.04);
}
.skill-card:hover { border-color: rgba(255,255,255,0.28); background: rgba(255,255,255,0.06); }

.skill-header { display: flex; align-items: center; justify-content: space-between; gap: .75rem; }
.skill-title { display: inline-flex; align-items: center; gap: .5rem; }
.skill-title .name { color: #fff; font-weight: 600; font-size: .95rem; }
.skill-dot { width: 8px; height: 8px; border-radius: 9999px; display: inline-block; }
.skill-dot.d-master { background: linear-gradient(90deg, #facc15, #fb923c); }
.skill-dot.d-adept { background: linear-gradient(90deg, #60a5fa, #a78bfa); }
.skill-dot.d-novice { background: linear-gradient(90deg, #9ca3af, #4b5563); }

.level-chip { display: inline-flex; align-items: center; gap: .4rem; font-size: .75rem; padding: .2rem .5rem; border-radius: 999px; border: 1px solid rgba(255,255,255,0.18); color: #fff; }
.level-chip[data-level="master"] { border-color: rgba(250,204,21,.6); color: #fde68a; }
.level-chip[data-level="adept"] { border-color: rgba(96,165,250,.6); color: #93c5fd; }
.level-chip[data-level="novice"] { border-color: rgba(156,163,175,.6); color: #d1d5db; }

/* removed legacy progress styles */

/* Scrollbar */
.overflow-y-auto::-webkit-scrollbar { width: 6px; }
.overflow-y-auto::-webkit-scrollbar-track { background: var(--color-glass-bg); border-radius: 3px; }
.overflow-y-auto::-webkit-scrollbar-thumb { background: var(--indicator-from); border-radius: 3px; }
.overflow-y-auto::-webkit-scrollbar-thumb:hover { background: var(--indicator-to); }
</style>
