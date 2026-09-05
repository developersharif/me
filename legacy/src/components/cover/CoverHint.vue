<template>
  <div class="mt-3 inline-flex items-center gap-4 text-sm magical-hint-container">
    <span class="magical-hint-text">{{ text }}</span>
    <div class="flex items-center gap-2 magical-arrow-container">
      <span class="magical-arrow">⟶</span>
      <span class="magical-trail-symbol">✦</span>
      <span class="magical-trail-symbol delay-1">✧</span>
      <span class="magical-trail-symbol delay-2">⋆</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
</script>
