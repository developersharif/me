<template>
  <button
    @click="$emit('toggle')"
    class="magical-sound-toggle"
    :class="{ 'sound-enabled': enabled, 'sound-disabled': !enabled }"
    :title="enabled ? 'Disable magical sounds' : 'Enable magical sounds'"
    aria-label="Toggle sound"
  >
    <AppIcon
      v-if="enabled"
      name="volume2"
      :size="20"
      :stroke-width="2"
      tw="sound-icon text-emerald-300"
    />
    <AppIcon
      v-else
      name="volumex"
      :size="20"
      :stroke-width="2"
      tw="sound-icon text-rose-300"
    />
  </button>
  
</template>

<script setup lang="ts">
import AppIcon from '../AppIcon.vue';
defineProps<{ enabled: boolean }>();
defineEmits<{ (e: 'toggle'): void }>();
</script>
