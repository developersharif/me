<template>
  <div class="plate" :class="[fitClass, { 'plate--term': !!project.plate }]">
    <img
      v-if="project.image"
      :src="workSrc(project.image.slug, 1600)"
      :srcset="workSrcset(project.image.slug)"
      :sizes="sizes"
      :width="project.image.w"
      :height="project.image.h"
      :alt="project.image.alt"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
    />
    <div v-else-if="project.plate" ref="term" class="term">
      <div class="term__bar" aria-hidden="true"><i></i><i></i><i></i><span class="mono">ubuilder — zsh</span></div>
      <pre class="term__body"><span v-for="(l, i) in project.plate.lines" :key="i" class="term__line" :class="{ ok: l.startsWith('✓') }">{{ l }}</span><span class="term__caret" aria-hidden="true"></span></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import type { Project } from '../types';
import { workSrc, workSrcset } from '../composables/useAssets';

const props = withDefaults(defineProps<{ project: Project; sizes?: string; eager?: boolean }>(), {
  sizes: '(min-width: 1024px) 70vw, 100vw',
  eager: false,
});

const fitClass = computed(() => (props.project.image?.fit === 'contain' ? 'plate--contain' : 'plate--cover'));
const term = ref<HTMLElement | null>(null);
let ctx: gsap.Context | undefined;

onMounted(() => {
  if (!term.value) return;
  ctx = gsap.context(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.term__line', {
        autoAlpha: 0,
        x: -6,
        stagger: 0.16,
        duration: 0.35,
        ease: 'power2.out',
        scrollTrigger: { trigger: term.value, start: 'top 80%', once: true },
      });
    });
  }, term.value);
});

onBeforeUnmount(() => ctx?.revert());
</script>

<style scoped>
.plate {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #1a1917;
  border-radius: 6px;
}

.plate img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.plate--contain img {
  object-fit: contain;
  padding: 6%;
}

.plate--term {
  background: #141311;
  border: 1px solid rgba(243, 238, 228, 0.1);
}

.term {
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #e8e2d6;
}

.term__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(243, 238, 228, 0.08);
}

.term__bar i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(243, 238, 228, 0.18);
}

.term__bar span {
  margin-left: auto;
  opacity: 0.45;
  font-size: 0.65rem;
}

.term__body {
  flex: 1;
  margin: 0;
  padding: clamp(16px, 3vw, 32px);
  font-family: var(--font-mono);
  font-size: clamp(0.78rem, 0.7vw + 0.45rem, 1.15rem);
  line-height: 1.9;
  white-space: pre-wrap;
  overflow: hidden;
}

.term__line {
  display: block;
}

.term__line:first-child {
  color: var(--paper);
}

.term__line.ok {
  color: var(--vermilion);
  margin-top: 0.6em;
}

.term__caret {
  display: inline-block;
  width: 0.55em;
  height: 1.05em;
  margin-top: 0.4em;
  background: var(--vermilion);
  vertical-align: text-bottom;
  animation: blink 1.1s steps(2, start) infinite;
}

@keyframes blink {
  to { visibility: hidden; }
}
</style>
