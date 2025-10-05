<template>
  <div class="relative magical-portal cursor-pointer group" @mouseenter="$emit('enter')" @mouseleave="$emit('leave')" @click="$emit('click')">
    <!-- Outer rotating rings -->
    <div class="absolute inset-0 w-40 h-40 magical-ring-system">
      <div class="absolute inset-0 rounded-full magical-ring-outer">
        <div class="absolute inset-2 rounded-full magical-ring-middle"></div>
        <div class="absolute inset-4 rounded-full magical-ring-inner"></div>
      </div>
      
      <!-- Orbiting symbols -->
      <div v-for="(symbol, i) in symbols" :key="i" class="absolute magical-symbol" :class="`symbol-${i}`"
           :style="{ '--delay': i * 0.4 + 's', '--orbit-size': (i % 2 === 0 ? 75 : 90) + 'px' }"
           @mouseenter="$emit('symbol-hover', i)">
        <span class="symbol-glyph">{{ symbol }}</span>
      </div>
      
      <!-- Energy wisps -->
      <div v-for="i in 3" :key="`wisp-${i}`" class="absolute magical-wisp" :class="`wisp-${i}`" :style="{ '--wisp-delay': i * 1.2 + 's' }">
        <div class="wisp-trail"></div>
      </div>
    </div>

    <!-- Main crystal container -->
    <div class="relative w-40 h-40 magical-crystal-container">
      <!-- Pulsing aura layers -->
      <div class="absolute inset-3 rounded-full magical-aura"></div>
      <div class="absolute inset-5 rounded-full magical-core"></div>
      
      <!-- Central hexagon crystal -->
      <div class="absolute inset-8 magical-crystal-hex">
        <!-- Hexagon shape with gradient fill -->
        <svg viewBox="0 0 100 100" class="w-full h-full">
          <defs>
            <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:rgb(147,51,234);stop-opacity:0.8" />
              <stop offset="50%" style="stop-color:rgb(79,70,229);stop-opacity:0.9" />
              <stop offset="100%" style="stop-color:rgb(168,85,247);stop-opacity:0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <polygon points="50,5 93.3,25 93.3,75 50,95 6.7,75 6.7,25" 
                   fill="url(#hexGrad)" 
                   stroke="rgba(255,255,255,0.6)" 
                   stroke-width="2"
                   filter="url(#glow)"
                   class="hex-shape"/>
        </svg>
        
        <!-- Inner geometric patterns -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="relative w-full h-full">
            <!-- Rotating inner hexagons -->
            <svg viewBox="0 0 100 100" class="absolute inset-0 w-full h-full hex-inner-1">
              <polygon points="50,20 75,35 75,65 50,80 25,65 25,35" 
                       fill="none" 
                       stroke="rgba(255,255,255,0.4)" 
                       stroke-width="1.5"/>
            </svg>
            <svg viewBox="0 0 100 100" class="absolute inset-0 w-full h-full hex-inner-2">
              <polygon points="50,30 67,40 67,60 50,70 33,60 33,40" 
                       fill="none" 
                       stroke="rgba(147,51,234,0.6)" 
                       stroke-width="1.5"/>
            </svg>
            
            <!-- Center glowing core -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-3 h-3 rounded-full core-glow"></div>
            </div>
            
            <!-- Connecting lines -->
            <svg viewBox="0 0 100 100" class="absolute inset-0 w-full h-full connecting-lines">
              <line x1="50" y1="50" x2="50" y2="5" stroke="rgba(147,51,234,0.3)" stroke-width="1" class="line-anim" style="--line-delay: 0s"/>
              <line x1="50" y1="50" x2="93.3" y2="25" stroke="rgba(147,51,234,0.3)" stroke-width="1" class="line-anim" style="--line-delay: 0.2s"/>
              <line x1="50" y1="50" x2="93.3" y2="75" stroke="rgba(147,51,234,0.3)" stroke-width="1" class="line-anim" style="--line-delay: 0.4s"/>
              <line x1="50" y1="50" x2="50" y2="95" stroke="rgba(147,51,234,0.3)" stroke-width="1" class="line-anim" style="--line-delay: 0.6s"/>
              <line x1="50" y1="50" x2="6.7" y2="75" stroke="rgba(147,51,234,0.3)" stroke-width="1" class="line-anim" style="--line-delay: 0.8s"/>
              <line x1="50" y1="50" x2="6.7" y2="25" stroke="rgba(147,51,234,0.3)" stroke-width="1" class="line-anim" style="--line-delay: 1s"/>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Floating sparkles -->
      <div v-for="i in 8" :key="`sparkle-${i}`" class="absolute sparkle-enhanced" :class="`sparkle-${i}`"
           :style="{ '--sparkle-delay': i * 0.25 + 's', '--sparkle-size': (Math.random() * 0.3 + 0.9) + 'rem', '--sparkle-intensity': sparkleIntensity }"
           @mouseenter="$emit('sparkle-hover', i)">
        <span class="sparkle-glyph">{{ sparkleSymbols[i % sparkleSymbols.length] }}</span>
      </div>
    </div>

    <!-- Magic level progress ring -->
    <div v-if="magicLevel > 0" class="absolute inset-0 magical-progress-ring" :style="{ '--progress': (magicLevel / 10) * 100 + '%' }">
      <svg class="w-full h-full" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="78" fill="none" stroke="rgba(147, 51, 234, 0.2)" stroke-width="2" class="progress-bg" />
        <circle cx="80" cy="80" r="78" fill="none" stroke="url(#progressGrad)" stroke-width="3" stroke-linecap="round"
                class="progress-fill" :stroke-dasharray="490" :stroke-dashoffset="490 - (490 * magicLevel / 10)" />
        <defs>
          <linearGradient id="progressGrad">
            <stop offset="0%" stop-color="rgba(147, 51, 234, 0.9)" />
            <stop offset="100%" stop-color="rgba(168, 85, 247, 1)" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Enhanced particle system -->
    <div class="absolute inset-0 pointer-events-none magical-particles-container">
      <div v-for="i in 6" :key="`particle-${i}`" class="absolute magical-particle-enhanced" :class="`particle-${i}`" :style="{ '--particle-delay': i * 0.4 + 's' }">
        <div class="particle-core"></div>
        <div class="particle-trail"></div>
      </div>
    </div>
    
    <!-- Vortex effect -->
    <div class="absolute inset-0 magical-vortex pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ symbols: string[]; sparkleSymbols: string[]; sparkleIntensity: number | string; magicLevel: number }>();
defineEmits<{ (e: 'enter'): void; (e: 'leave'): void; (e: 'click'): void; (e: 'symbol-hover', i: number): void; (e: 'sparkle-hover', i: number): void }>();
</script>
