<template>
  <button
    @click="$emit('toggle')"
    class="sound-toggle"
    :class="{ 'is-on': enabled }"
    :title="enabled ? 'Mute sounds' : 'Enable sounds'"
    aria-label="Toggle sound"
  >
    <span class="toggle-track">
      <span class="toggle-thumb">
        <svg v-if="enabled" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
        <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps<{ enabled: boolean }>();
defineEmits<{ (e: 'toggle'): void }>();
</script>

<style scoped>
.sound-toggle {
  position: relative;
  width: 44px;
  height: 24px;
  padding: 2px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: all 0.25s ease;
  outline: none;
}

.sound-toggle:hover {
  border-color: rgba(147, 51, 234, 0.5);
  box-shadow: 0 0 12px rgba(147, 51, 234, 0.3);
}

.sound-toggle:focus-visible {
  box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.6);
}

.toggle-track {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.toggle-thumb {
  position: absolute;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(100, 100, 120, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.sound-toggle.is-on .toggle-thumb {
  left: calc(100% - 18px);
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.9), rgba(79, 70, 229, 0.9));
  box-shadow: 0 0 8px rgba(147, 51, 234, 0.6);
}

.icon {
  width: 10px;
  height: 10px;
  color: rgba(255, 255, 255, 0.8);
}

.sound-toggle.is-on .icon {
  color: white;
}
</style>
