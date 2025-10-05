<template>
  <section class="h-full flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-5 flex-shrink-0">
      <div class="flex items-center gap-3">
        <div class="text-2xl sm:text-3xl"><AppIcon name="star" :size="24" tw="text-amber-300 sm:w-7 sm:h-7" /></div>
        <div class="flex-1">
          <h2 class="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Chapter V: Signals
          </h2>
          <p class="text-white/60 text-xs sm:text-sm font-mono mt-0.5">Let's make something useful together</p>
        </div>
      </div>
      <button
        v-if="data.email"
        class="text-xs sm:text-sm px-3 py-1.5 sm:py-2 rounded-lg border border-white/10 hover:border-emerald-400/40 
               text-white/80 hover:text-white/100 transition-all w-fit hover:bg-emerald-400/10 active:scale-95"
        @click="copyEmail"
        :title="copied ? 'Copied!' : 'Copy email'"
      >
        <span class="flex items-center gap-2">
          <AppIcon :name="copied ? 'check' : 'copy'" :size="14" tw="text-white" />
          {{ copied ? 'Copied!' : 'Copy email' }}
        </span>
      </button>
    </div>

    <!-- Content -->
    <div class="flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 flex-1 overflow-hidden">
      <!-- Left: calling card -->
      <div class="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm 
                  p-4 sm:p-5 md:p-6 flex flex-col justify-between lg:min-h-0 flex-shrink-0">
        <div class="space-y-2 sm:space-y-3">
          <div class="icon-container">
            <AppIcon name="zap" :size="40" tw="text-cyan-400 sm:w-12 sm:h-12 md:w-14 md:h-14" />
          </div>
          <h3 class="text-base sm:text-lg md:text-xl font-semibold text-white">Open channels</h3>
          <p class="text-white/70 text-xs sm:text-sm leading-relaxed">
            Prefer async? Email works best. DMs are fine too. I reply within a day.
          </p>
        </div>
        <div class="mt-4 sm:mt-5 space-y-2 sm:space-y-3">
          <a :href="'mailto:' + data.email" class="btn-primary group">
            <span class="icon-wrapper"><AppIcon name="mail" :size="18" tw="text-white" /></span>
            <span class="flex-1 text-left truncate text-sm sm:text-base">{{ data.email }}</span>
            <span class="opacity-60 group-hover:opacity-100 transition-opacity">→</span>
          </a>
          <a v-if="data.x" :href="data.x" target="_blank" rel="noopener" class="btn-secondary group">
            <span class="icon-wrapper"><AppIcon name="twitter" :size="18" tw="text-white" /></span>
            <span class="flex-1 text-left text-sm sm:text-base">DM on X</span>
            <span class="opacity-60 group-hover:opacity-100 transition-opacity">↗</span>
          </a>
          <a v-if="data.products?.bgRemover" :href="data.products.bgRemover" target="_blank" rel="noopener" class="btn-glow group">
            <span class="icon-wrapper"><AppIcon name="app-window" :size="18" tw="text-white" /></span>
            <span class="flex-1 text-left text-sm sm:text-base">BG Remover — Offline</span>
            <span class="opacity-60 group-hover:opacity-100 transition-opacity">↗</span>
          </a>
        </div>
      </div>

      <!-- Right: links grid -->
      <div class="overflow-y-auto pr-1 flex-1 pb-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          <a :href="data.github" target="_blank" rel="noopener" class="tile group">
            <span class="icon-badge"><AppIcon name="github" :size="18" tw="align-middle" /></span>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-white text-sm sm:text-base truncate">GitHub</div>
              <div class="text-xs text-white/60">Code, OSS, experiments</div>
            </div>
            <span class="arrow-icon">→</span>
          </a>
          <a :href="data.linkedin" target="_blank" rel="noopener" class="tile group">
            <span class="icon-badge"><AppIcon name="linkedin" :size="18" tw="align-middle" /></span>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-white text-sm sm:text-base truncate">LinkedIn</div>
              <div class="text-xs text-white/60">Work and updates</div>
            </div>
            <span class="arrow-icon">→</span>
          </a>
          <a v-if="data.medium" :href="data.medium" target="_blank" rel="noopener" class="tile group">
            <span class="icon-badge"><AppIcon name="pen" :size="18" tw="text-white" /></span>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-white text-sm sm:text-base truncate">Medium</div>
              <div class="text-xs text-white/60">Writing & notes</div>
            </div>
            <span class="arrow-icon">→</span>
          </a>
          <a v-if="data.youtube" :href="data.youtube" target="_blank" rel="noopener" class="tile group">
            <span class="icon-badge"><AppIcon name="play" :size="18" tw="text-white" /></span>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-white text-sm sm:text-base truncate">YouTube</div>
              <div class="text-xs text-white/60">Tutorials & demos</div>
            </div>
            <span class="arrow-icon">→</span>
          </a>
          <a v-if="data.buymeacoffee" :href="data.buymeacoffee" target="_blank" rel="noopener" class="tile group">
            <span class="icon-badge"><AppIcon name="coffee" :size="18" tw="text-white" /></span>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-white text-sm sm:text-base truncate">Buy Me a Coffee</div>
              <div class="text-xs text-white/60">Support my indie work</div>
            </div>
            <span class="arrow-icon">→</span>
          </a>
          <a v-if="data.products?.bgRemover" :href="data.products.bgRemover" target="_blank" rel="noopener" class="tile tile-featured group">
            <span class="icon-badge featured"><AppIcon name="sparkles" :size="18" tw="text-white" /></span>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-white text-sm sm:text-base truncate">Featured: BG Remover</div>
              <div class="text-xs text-white/60">GPU offline background removal</div>
            </div>
            <span class="arrow-icon">→</span>
          </a>
        </div>
        <p class="text-center text-white/50 text-xs sm:text-sm mt-3 sm:mt-4 md:mt-5 italic">
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
/* Icon container with professional glow animation */
.icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: icon-glow 3s ease-in-out infinite;
}

@keyframes icon-glow {
  0%, 100% {
    filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 16px rgba(34, 211, 238, 0.7));
  }
}

/* Contact buttons with improved mobile UX */
.btn-primary,
.btn-secondary,
.btn-glow {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.12);
  background: linear-gradient(135deg, rgba(59,130,246,0.18), rgba(34,211,238,0.14));
  color: #fff;
  text-decoration: none;
  transition: all .25s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.875rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.btn-primary::before,
.btn-secondary::before,
.btn-glow::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  opacity: 0;
  transition: opacity .25s ease;
}

.btn-primary:active,
.btn-secondary:active,
.btn-glow:active {
  transform: scale(0.98);
}

/* Desktop hover effects */
@media (hover: hover) {
  .btn-primary:hover::before,
  .btn-secondary:hover::before,
  .btn-glow:hover::before {
    opacity: 1;
  }
  
  .btn-primary:hover,
  .btn-secondary:hover,
  .btn-glow:hover { 
    transform: translateY(-2px); 
    border-color: rgba(255,255,255,0.25); 
    box-shadow: 0 8px 24px rgba(0,0,0,0.4); 
  }
}

/* Mobile adjustments */
@media (min-width: 640px) {
  .btn-primary,
  .btn-secondary,
  .btn-glow {
    padding: 14px 16px;
    gap: 10px;
  }
}

.btn-secondary { 
  background: linear-gradient(135deg, rgba(99,102,241,0.16), rgba(168,85,247,0.14)); 
}

.btn-glow { 
  background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(37,99,235,0.16));
  border-color: rgba(16,185,129,0.2);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Improved tiles with better mobile touch targets */
.tile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: radial-gradient(120% 140% at 0% 0%, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  color: #fff;
  text-decoration: none;
  transition: all .25s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 72px;
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.tile::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 140% at 0% 0%, rgba(16,185,129,0.08), transparent);
  opacity: 0;
  transition: opacity .25s ease;
}

.tile:active {
  transform: scale(0.98);
}

/* Desktop hover effects */
@media (hover: hover) {
  .tile:hover::before {
    opacity: 1;
  }
  
  .tile:hover { 
    transform: translateY(-2px); 
    border-color: rgba(255,255,255,0.16); 
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }
  
  .tile:hover .arrow-icon {
    transform: translate(2px, -2px);
  }
}

/* Featured tile with special styling */
.tile-featured {
  border-color: rgba(16,185,129,0.2);
  background: radial-gradient(120% 140% at 0% 0%, rgba(16,185,129,0.1), rgba(37,99,235,0.05));
}

.icon-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  flex-shrink: 0;
  transition: all .25s ease;
}

.icon-badge.featured {
  background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(37,99,235,0.15));
}

.arrow-icon {
  opacity: 0.5;
  transition: all .25s ease;
  flex-shrink: 0;
  font-size: 1.125rem;
}

@media (hover: hover) {
  .tile:hover .icon-badge {
    background: rgba(255,255,255,0.15);
    transform: scale(1.05);
  }
  
  .tile:hover .arrow-icon {
    opacity: 1;
  }
}

/* Better tablet/desktop spacing */
@media (min-width: 640px) {
  .tile {
    gap: 12px;
    padding: 14px;
    min-height: 80px;
  }
  
  .icon-badge {
    width: 40px;
    height: 40px;
  }
}

@media (min-width: 768px) {
  .tile {
    padding: 16px;
  }
}

/* Custom scrollbar for links section */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.4);
  border-radius: 3px;
  transition: background .2s ease;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.6);
}
</style>
