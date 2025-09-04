<template>
  <button @click="$emit('toggle')" class="magical-sound-toggle" :class="{ 'sound-enabled': enabled, 'sound-disabled': !enabled }" :title="enabled ? 'Disable magical sounds' : 'Enable magical sounds'">
    <span v-if="enabled" class="sound-icon">🔊</span>
    <span v-else class="sound-icon">🔇</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{ enabled: boolean }>();
defineEmits<{ (e: 'toggle'): void }>();
</script>
