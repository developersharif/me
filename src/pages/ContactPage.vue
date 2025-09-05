<template>
  <section class="h-full flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-5 flex-shrink-0">
  <div class="text-3xl"><AppIcon name="star" :size="28" tw="text-amber-300" /></div>
      <div class="flex-1">
        <h2 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Chapter V: Signals
        </h2>
        <p class="text-white/60 text-sm font-mono">Let's make something useful together</p>
      </div>
      <button
        v-if="data.email"
        class="text-sm px-3 py-1.5 rounded border border-white/10 hover:border-white/20 text-white/80 hover:text-white/100 transition w-fit"
        @click="copyEmail"
        :title="copied ? 'Copied!' : 'Copy email'"
      >
        {{ copied ? 'Copied ✓' : 'Copy email' }}
      </button>
    </div>

    <!-- Content -->
    <div class="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 flex-1 overflow-hidden">
      <!-- Left: calling card -->
      <div class="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4 sm:p-5 flex flex-col justify-between min-h-[280px] lg:min-h-0">
        <div class="space-y-3">
          <div class="text-4xl sm:text-6xl animate-pulse-slow select-none">*</div>
          <h3 class="text-lg sm:text-xl font-semibold text-white">Open channels</h3>
          <p class="text-white/70 text-sm leading-relaxed">
            Prefer async? Email works best. DMs are fine too. I reply within a day.
          </p>
        </div>
        <div class="mt-4 space-y-3">
          <a :href="'mailto:' + data.email" class="btn-primary">
            <span class="text-lg"><AppIcon name="mail" :size="18" tw="text-white" /></span>
            <span class="flex-1 text-left truncate">{{ data.email }}</span>
            <span class="opacity-60">↗</span>
          </a>
          <a v-if="data.x" :href="data.x" target="_blank" rel="noopener" class="btn-secondary">
            <span class="text-lg"><AppIcon name="twitter" :size="18" tw="text-white" /></span>
            <span class="flex-1 text-left">DM on X</span>
            <span class="opacity-60">↗</span>
          </a>
          <a v-if="data.products?.bgRemover" :href="data.products.bgRemover" target="_blank" rel="noopener" class="btn-glow">
            <span class="text-lg"><AppIcon name="app-window" :size="18" tw="text-white" /></span>
            <span class="flex-1 text-left">BG Remover — Offline</span>
            <span class="opacity-60">↗</span>
          </a>
        </div>
      </div>

      <!-- Right: links grid -->
      <div class="overflow-y-auto pr-1 flex-1">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <a :href="data.github" target="_blank" rel="noopener" class="tile">
            <span class="text-xs font-mono px-1 py-0.5 rounded bg-white/10"><AppIcon name="github" :size="16" tw="align-middle" /></span>
            <div>
              <div class="font-semibold text-white">GitHub</div>
              <div class="text-xs text-white/60">Code, OSS, experiments</div>
            </div>
          </a>
          <a :href="data.linkedin" target="_blank" rel="noopener" class="tile">
            <span class="text-xs font-mono px-1 py-0.5 rounded bg-white/10"><AppIcon name="linkedin" :size="16" tw="align-middle" /></span>
            <div>
              <div class="font-semibold text-white">LinkedIn</div>
              <div class="text-xs text-white/60">Work and updates</div>
            </div>
          </a>
          <a v-if="data.medium" :href="data.medium" target="_blank" rel="noopener" class="tile">
            <span class="text-xl"><AppIcon name="pen" :size="18" tw="text-white" /></span>
            <div>
              <div class="font-semibold text-white">Medium</div>
              <div class="text-xs text-white/60">Writing & notes</div>
            </div>
          </a>
          <a v-if="data.youtube" :href="data.youtube" target="_blank" rel="noopener" class="tile">
            <span class="text-xl"><AppIcon name="play" :size="18" tw="text-white" /></span>
            <div>
              <div class="font-semibold text-white">YouTube</div>
              <div class="text-xs text-white/60">Tutorials & demos</div>
            </div>
          </a>
          <a v-if="data.buymeacoffee" :href="data.buymeacoffee" target="_blank" rel="noopener" class="tile">
            <span class="text-xl"><AppIcon name="coffee" :size="18" tw="text-white" /></span>
            <div>
              <div class="font-semibold text-white">Buy Me a Coffee</div>
              <div class="text-xs text-white/60">Support my indie work</div>
            </div>
          </a>
          <a v-if="data.products?.bgRemover" :href="data.products.bgRemover" target="_blank" rel="noopener" class="tile">
            <span class="text-xl"><AppIcon name="sparkles" :size="18" tw="text-white" /></span>
            <div>
              <div class="font-semibold text-white">Featured: BG Remover</div>
              <div class="text-xs text-white/60">GPU offline background removal</div>
            </div>
          </a>
        </div>
        <p class="text-center text-white/50 text-xs mt-4 sm:mt-5">
          "Connections compound over time."
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
import AppIcon from '../components/AppIcon.vue';
interface ContactData {
  email: string;
  github: string;
  linkedin: string;
  x?: string;
  medium?: string;
  youtube?: string;
  buymeacoffee?: string;
  cv?: string;
  products?: { bgRemover?: string };
}
const props = defineProps<{ data?: ContactData }>();
const data = props.data ?? {
  email: 'your@example.com',
  github: '#',
  linkedin: '#',
  x: '#',
  medium: '#',
  youtube: '#',
  buymeacoffee: '#',
  products: { bgRemover: '#' }
};

import { ref } from 'vue';
const copied = ref(false);
function copyEmail() {
  if (!data.email) return;
  navigator.clipboard?.writeText(data.email).then(() => {
    copied.value = true;
    setTimeout(() => (copied.value = false), 1200);
  });
}
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

/* new buttons */
.btn-primary,
.btn-secondary,
.btn-glow {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.12);
  background: linear-gradient(135deg, rgba(59,130,246,0.18), rgba(34,211,238,0.14));
  color: #fff;
  text-decoration: none;
  transition: transform .15s ease, box-shadow .2s ease, border-color .2s ease;
  font-size: 0.875rem;
}

/* Mobile adjustments */
@media (min-width: 640px) {
  .btn-primary,
  .btn-secondary,
  .btn-glow {
    padding: 12px 14px;
    font-size: 1rem;
  }
}

.btn-secondary { background: linear-gradient(135deg, rgba(99,102,241,0.14), rgba(168,85,247,0.12)); }
.btn-glow { background: linear-gradient(135deg, rgba(16,185,129,0.18), rgba(37,99,235,0.14)); }
.btn-primary:hover,
.btn-secondary:hover,
.btn-glow:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.2); box-shadow: 0 8px 24px rgba(0,0,0,0.35); }

/* tiles */
.tile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: radial-gradient(120% 140% at 0% 0%, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  color: #fff;
  text-decoration: none;
  transition: transform .15s ease, border-color .2s ease, background .2s ease;
  min-height: 60px;
}

/* Mobile adjustments for tiles */
@media (min-width: 640px) {
  .tile {
    gap: 12px;
    padding: 14px;
    min-height: auto;
  }
}

.tile:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.16); background: radial-gradient(120% 140% at 0% 0%, rgba(255,255,255,0.1), rgba(255,255,255,0.02)); }
</style>
