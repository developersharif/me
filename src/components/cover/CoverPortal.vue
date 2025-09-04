<template>
  <div class="relative magical-portal cursor-pointer" @mouseenter="$emit('enter')" @mouseleave="$emit('leave')" @click="$emit('click')">
    <div class="absolute inset-0 w-36 h-36 magical-ring-system">
      <div class="absolute inset-0 rounded-full magical-ring-outer">
        <div class="absolute inset-1 rounded-full magical-ring-middle"></div>
        <div class="absolute inset-3 rounded-full magical-ring-inner"></div>
      </div>
      <div v-for="(symbol, i) in symbols" :key="i" class="absolute magical-symbol" :class="`symbol-${i}`"
           :style="{ '--delay': i * 0.4 + 's', '--orbit-size': (i % 2 === 0 ? 70 : 85) + 'px' }"
           @mouseenter="$emit('symbol-hover', i)">
        <span class="symbol-glyph">{{ symbol }}</span>
      </div>
      <div v-for="i in 6" :key="`wisp-${i}`" class="absolute magical-wisp" :class="`wisp-${i}`" :style="{ '--wisp-delay': i * 0.8 + 's' }">
        <div class="wisp-trail"></div>
      </div>
    </div>

  <div class="relative w-36 h-36 magical-crystal-container">
      <div class="absolute inset-2 rounded-full magical-aura"></div>
      <div class="absolute inset-4 rounded-full magical-core"></div>
      <div class="absolute inset-6 rounded-full magical-crystal">
        <div class="absolute inset-0 crystal-facets">
          <div class="facet facet-1"></div>
          <div class="facet facet-2"></div>
          <div class="facet facet-3"></div>
        </div>
        <div class="relative w-full h-full flex items-center justify-center magical-orb">
          <div class="text-4xl magical-emoji">🔮</div>
        </div>
      </div>
      <div v-for="i in 16" :key="`sparkle-${i}`" class="absolute sparkle-enhanced" :class="`sparkle-${i}`"
           :style="{ '--sparkle-delay': i * 0.15 + 's', '--sparkle-size': (Math.random() * 0.5 + 0.8) + 'rem', '--sparkle-intensity': sparkleIntensity }"
           @mouseenter="$emit('sparkle-hover', i)">
        <span class="sparkle-glyph">{{ sparkleSymbols[i % sparkleSymbols.length] }}</span>
      </div>
    </div>

    <div v-if="magicLevel > 0" class="absolute inset-0 magical-progress-ring" :style="{ '--progress': (magicLevel / 10) * 100 + '%' }">
      <svg class="w-full h-full" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r="70" fill="none" stroke="rgba(147, 51, 234, 0.3)" stroke-width="2" class="progress-bg" />
        <circle cx="72" cy="72" r="70" fill="none" stroke="rgba(147, 51, 234, 0.8)" stroke-width="3" stroke-linecap="round"
                class="progress-fill" :stroke-dasharray="440" :stroke-dashoffset="440 - (440 * magicLevel / 10)" />
      </svg>
    </div>

    <div class="absolute inset-0 pointer-events-none magical-particles-container">
      <div v-for="i in 12" :key="`particle-${i}`" class="absolute magical-particle-enhanced" :class="`particle-${i}`" :style="{ '--particle-delay': i * 0.2 + 's' }">
        <div class="particle-core"></div>
        <div class="particle-trail"></div>
      </div>
    </div>
  <div class="absolute inset-0 magical-vortex pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ symbols: string[]; sparkleSymbols: string[]; sparkleIntensity: number | string; magicLevel: number }>();
defineEmits<{ (e: 'enter'): void; (e: 'leave'): void; (e: 'click'): void; (e: 'symbol-hover', i: number): void; (e: 'sparkle-hover', i: number): void }>();
</script>
