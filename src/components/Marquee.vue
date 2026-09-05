<template>
  <div class="marquee" aria-hidden="true">
    <div class="marquee__track" :style="{ animationDuration: duration + 's' }">
      <span v-for="(it, i) in doubled" :key="i" class="marquee__item display">
        {{ it }}<i class="marquee__dot"></i>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{ items: string[]; speed?: number }>(), { speed: 26 });
const doubled = computed(() => [...props.items, ...props.items]);
const duration = computed(() => Math.max(16, props.items.length * (props.speed / 10)));
</script>

<style scoped>
.marquee {
  overflow: hidden;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: clamp(10px, 1.6vh, 18px) 0;
  white-space: nowrap;
}

.marquee__track {
  display: inline-flex;
  align-items: center;
  animation: marquee linear infinite;
  will-change: transform;
}

.marquee__item {
  display: inline-flex;
  align-items: center;
  font-size: clamp(1.4rem, 3.2vw, 3rem);
  font-style: italic;
  font-weight: 400;
  padding-right: 0.55em;
}

.marquee__dot {
  display: inline-block;
  width: 0.28em;
  height: 0.28em;
  margin-left: 0.55em;
  border-radius: 50%;
  background: var(--accent);
}
</style>
