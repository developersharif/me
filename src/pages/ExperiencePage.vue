<template>
  <section class="h-full flex flex-col overflow-hidden">
    <div class="flex items-center gap-3 mb-4 flex-shrink-0">
      <div class="text-2xl"><AppIcon name="target" :size="24" tw="text-amber-300" /></div>
      <h2 class="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
        Quests & Experience
      </h2>
      <span class="ml-auto text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/70">
        Simplified view
      </span>
    </div>
    <div class="flex-1 overflow-y-auto">
      <ul class="grid sm:grid-cols-2 gap-4">
        <li v-for="item in data" :key="item.title" class="quest-card group">
          <div class="quest-card-inner">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="font-semibold text-white/90">{{ item.title }}</div>
                <div class="text-xs text-white/60 mt-0.5">{{ item.time }}</div>
              </div>
              <span class="quest-badge inline-flex items-center gap-1"><AppIcon name="briefcase" :size="14" /> Role</span>
            </div>
            <p class="text-sm text-white/75 leading-relaxed mt-3">
              {{ item.desc }}
            </p>
            <div class="meta-row">
              <span class="meta-chip"><AppIcon name="timeline" :size="14" /> {{ item.time }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import AppIcon from '../components/AppIcon.vue';
type ExperienceItem = { title: string; time: string; desc: string };
const props = defineProps<{ data?: ExperienceItem[] }>();
const data = props.data ?? [];
</script>

<style scoped>
.quest-card {
  position: relative;
  border-radius: 0.5rem;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  transform-style: preserve-3d;
}
.quest-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(600px 120px at 80% 110%, rgba(251,191,36,0.15), transparent 60%);
  opacity: 0;
  transition: opacity .3s ease;
}
.quest-card:hover::before { opacity: 1; }
.quest-card-inner { padding: 1rem; }
.quest-badge {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .08em;
  font-weight: 700;
  color: #fbbf24; /* amber-300 */
  padding: .25rem .5rem;
  border-radius: .375rem;
  border: 1px solid rgba(251,191,36,0.3);
  background: rgba(245,158,11,0.1);
}
/* removed XP bar in favor of compact meta chips */
.meta-row { display: flex; gap: .5rem; margin-top: .5rem; }
.meta-chip { font-size: .7rem; color: rgba(255,255,255,.7); border: 1px solid rgba(255,255,255,.15); padding: .2rem .45rem; border-radius: 999px; display: inline-flex; align-items: center; gap: .35rem; }

/* Hover tilt */
.quest-card:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,.25); }

/* Scrollbar */
.overflow-y-auto::-webkit-scrollbar { width: 6px; }
.overflow-y-auto::-webkit-scrollbar-thumb { background: rgba(255,255,255,.25); border-radius: 3px; }
</style>
