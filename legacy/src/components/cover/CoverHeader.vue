<template>
  <div class="relative z-10 flex flex-col items-center">
  <div class="mb-6 md:mb-4 text-6xl md:text-5xl opacity-60 animate-pulse-slow ch-symbol">{{ symbol }}</div>
  <div class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 md:mb-3 text-balance text-center ch-title">
      <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
        {{ titlePrefix }}
      </span>
    </div>
  <div class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 ch-name">{{ name }}</div>
  <div class="text-accent-300 font-mono text-lg tracking-wide mb-6 md:mb-4 ch-tagline">{{ tagline }}</div>
  <p class="max-w-2xl text-white/70 text-lg leading-relaxed mb-8 md:mb-6 ch-subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ symbol: string; titlePrefix: string; name: string; tagline: string; subtitle: string }>();
</script>
