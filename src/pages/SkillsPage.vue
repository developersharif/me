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

    <!-- Legend -->
    <div class="legend">
      <span class="legend-item"><i class="dot dot-master"></i> Master</span>
      <span class="legend-item"><i class="dot dot-adept"></i> Adept</span>
      <span class="legend-item"><i class="dot dot-novice"></i> Novice</span>
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
          <div v-for="skill in group.skills" :key="skill.name" :class="['skill-row', colorClass(skill.color)]" role="listitem">
            <div class="row-top">
              <div class="skill-name">{{ skill.name }}</div>
              <span class="level-badge" :data-level="skill.level">{{ prettyLevel(skill.level) }}</span>
            </div>
            <div class="row-middle">
              <div class="progress">
                <div class="bar" :style="{ width: levelPercent(skill.level) + '%' }"></div>
              </div>
              <div class="percent">{{ levelPercent(skill.level) }}%</div>
            </div>
            <div v-if="skill.description" class="row-bottom">{{ skill.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
  
</template>

<script setup lang="ts">
interface Skill { name: string; level: 'novice'|'adept'|'master'; color: string; description?: string }
interface SkillsGroup { icon: string; title: string; subtitle: string; skills: Skill[] }
interface SkillsData { groups: SkillsGroup[] }

const props = defineProps<{ data?: SkillsData }>();
const data = props.data ?? { groups: [] };

const LEVEL_ORDER: Record<Skill['level'], number> = { master: 3, adept: 2, novice: 1 };
const LEVEL_PERCENT: Record<Skill['level'], number> = { master: 92, adept: 78, novice: 60 };

const groups = (data.groups || []).map(g => ({
  ...g,
  skills: [...g.skills].sort((a, b) => LEVEL_ORDER[b.level] - LEVEL_ORDER[a.level] || a.name.localeCompare(b.name))
}));

function levelPercent(level: Skill['level']) { return LEVEL_PERCENT[level] ?? 65; }
function prettyLevel(level: Skill['level']) { return level.charAt(0).toUpperCase() + level.slice(1); }

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
.dot { width: 10px; height: 10px; border-radius: 9999px; display: inline-block; }
.dot-master { background: linear-gradient(90deg, #facc15, #fb923c); }
.dot-adept { background: linear-gradient(90deg, #60a5fa, #a78bfa); }
.dot-novice { background: linear-gradient(90deg, #9ca3af, #4b5563); }

/* Rows */
.skills-list { display: grid; grid-template-columns: 1fr; gap: .6rem; }
@media (min-width: 640px) { .skills-list { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .skills-list { grid-template-columns: 1fr 1fr; } }

.skill-row {
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: .75rem .85rem;
  background: rgba(255,255,255,0.04);
}
.skill-row:hover { border-color: rgba(255,255,255,0.28); background: rgba(255,255,255,0.06); }

.row-top { display: flex; align-items: center; justify-content: space-between; gap: .75rem; margin-bottom: .5rem; }
.skill-name { color: #fff; font-weight: 600; font-size: .95rem; }
.level-badge { font-size: .7rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #0b1020; padding: .2rem .55rem; border-radius: 999px; background: #e5e7eb; }
.level-badge[data-level="master"] { color: #111827; background: linear-gradient(90deg, #facc15, #fb923c); }
.level-badge[data-level="adept"] { color: #0b1020; background: linear-gradient(90deg, #60a5fa, #a78bfa); }
.level-badge[data-level="novice"] { color: #0b1020; background: linear-gradient(90deg, #9ca3af, #4b5563); }

.row-middle { display: flex; align-items: center; gap: .5rem; }
.progress { flex: 1; height: 8px; border-radius: 999px; background: rgba(255,255,255,0.12); overflow: hidden; }
.bar { height: 100%; border-radius: inherit; background: linear-gradient(90deg, rgba(125,211,252,.9), rgba(59,130,246,.9)); box-shadow: 0 0 0 1px rgba(255,255,255,0.06) inset; }
.percent { color: rgba(255,255,255,.75); font-size: .75rem; min-width: 2.5rem; text-align: right; }

.row-bottom { color: rgba(255,255,255,.75); font-size: .85rem; margin-top: .45rem; }

/* Color accents by skill color */
.c-emerald .bar { background: linear-gradient(90deg, #34d399, #10b981); }
.c-blue .bar { background: linear-gradient(90deg, #60a5fa, #3b82f6); }
.c-purple .bar { background: linear-gradient(90deg, #a78bfa, #8b5cf6); }
.c-green .bar { background: linear-gradient(90deg, #86efac, #22c55e); }
.c-cyan .bar { background: linear-gradient(90deg, #67e8f9, #06b6d4); }
.c-yellow .bar { background: linear-gradient(90deg, #fcd34d, #f59e0b); }
.c-gray .bar { background: linear-gradient(90deg, #d1d5db, #6b7280); }
.c-indigo .bar { background: linear-gradient(90deg, #93c5fd, #6366f1); }
.c-pink .bar { background: linear-gradient(90deg, #f9a8d4, #ec4899); }
.c-red .bar { background: linear-gradient(90deg, #fca5a5, #ef4444); }
.c-orange .bar { background: linear-gradient(90deg, #fdba74, #f97316); }
.c-violet .bar { background: linear-gradient(90deg, #c4b5fd, #7c3aed); }

/* Scrollbar */
.overflow-y-auto::-webkit-scrollbar { width: 6px; }
.overflow-y-auto::-webkit-scrollbar-track { background: var(--color-glass-bg); border-radius: 3px; }
.overflow-y-auto::-webkit-scrollbar-thumb { background: var(--indicator-from); border-radius: 3px; }
.overflow-y-auto::-webkit-scrollbar-thumb:hover { background: var(--indicator-to); }
</style>
