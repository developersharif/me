<template>
  <div v-if="show" ref="root" class="curtain" aria-hidden="true">
    <div class="curtain__inner container">
      <div ref="meta" class="curtain__meta mono">
        <span>{{ name }}</span>
        <span>{{ role }}</span>
      </div>
      <div class="curtain__rail"><span ref="line" class="curtain__line"></span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../composables/useSiteState';
import { lockScroll } from '../composables/useSmoothScroll';

defineProps<{ name: string; role: string }>();
const emit = defineEmits<{ done: [] }>();

const KEY = 'sharif-intro-seen';
const seen = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(KEY) === '1';
const show = ref(!seen && !prefersReducedMotion());

const root = ref<HTMLElement | null>(null);
const line = ref<HTMLElement | null>(null);
const meta = ref<HTMLElement | null>(null);

onMounted(async () => {
  if (!show.value) {
    await nextTick();
    emit('done');
    return;
  }
  lockScroll(true);
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* private mode */
  }
  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    onComplete: () => {
      lockScroll(false);
      show.value = false;
      emit('done');
    },
  });
  tl.fromTo(meta.value, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0)
    .fromTo(line.value, { scaleX: 0 }, { scaleX: 1, duration: 1.05, ease: 'power4.inOut' }, 0.1)
    .to(meta.value, { autoAlpha: 0, duration: 0.3 }, '-=0.15')
    .to(root.value, { yPercent: -100, duration: 0.95, ease: 'power4.inOut' }, '-=0.2');
});
</script>

<style scoped>
.curtain {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: var(--ink);
  color: var(--paper);
  will-change: transform;
}

.curtain__inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 18px;
  padding-bottom: clamp(28px, 6vh, 64px);
}

.curtain__meta {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  opacity: 0;
}

.curtain__rail {
  height: 2px;
  background: rgba(243, 238, 228, 0.12);
}

.curtain__line {
  display: block;
  height: 100%;
  background: var(--vermilion);
  transform-origin: 0 50%;
  transform: scaleX(0);
}
</style>
