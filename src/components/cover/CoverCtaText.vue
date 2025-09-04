<template>
  <div class="magical-text-container" :class="{ activated }">
    <div class="magical-cta-box">
      <div class="magical-border-animation"></div>
      <div class="magical-cta-content">
        <span class="magical-cta-text">{{ text }}</span>
        <div class="absolute inset-0 flex items-center justify-center magical-runes">
          <span class="runic-text">⟨ ᛗᚨᚷᛁᚲ ᚨᚹᚨᛁᛏᛋ ⟩</span>
        </div>
      </div>
      <div v-for="i in 8" :key="`micro-${i}`" class="absolute micro-particle" :class="`micro-${i}`">
        <div class="micro-glow"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string; activated?: boolean }>();
</script>
