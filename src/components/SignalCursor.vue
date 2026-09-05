<template>
  <div v-if="enabled" ref="root" class="cursor" aria-hidden="true">
    <div ref="dot" class="cursor__dot"></div>
    <div ref="ring" class="cursor__ring">
      <span ref="label" class="cursor__label mono"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { hasFinePointer, prefersReducedMotion } from '../composables/useSiteState';

const enabled = typeof window !== 'undefined' && hasFinePointer() && !prefersReducedMotion();

const root = ref<HTMLElement | null>(null);
const dot = ref<HTMLElement | null>(null);
const ring = ref<HTMLElement | null>(null);
const label = ref<HTMLElement | null>(null);

let cleanup: (() => void) | undefined;

onMounted(() => {
  if (!enabled || !dot.value || !ring.value || !root.value) return;
  document.body.classList.add('has-cursor');

  const dotX = gsap.quickTo(dot.value, 'x', { duration: 0.12, ease: 'power3' });
  const dotY = gsap.quickTo(dot.value, 'y', { duration: 0.12, ease: 'power3' });
  const ringX = gsap.quickTo(ring.value, 'x', { duration: 0.38, ease: 'power3' });
  const ringY = gsap.quickTo(ring.value, 'y', { duration: 0.38, ease: 'power3' });
  const ringScale = gsap.quickTo(ring.value, 'scale', { duration: 0.35, ease: 'power3' });

  let visible = false;
  const show = () => {
    if (visible) return;
    visible = true;
    gsap.to(root.value, { autoAlpha: 1, duration: 0.3 });
  };
  const hide = () => {
    visible = false;
    gsap.to(root.value, { autoAlpha: 0, duration: 0.3 });
  };

  const onMove = (e: PointerEvent) => {
    dotX(e.clientX);
    dotY(e.clientY);
    ringX(e.clientX);
    ringY(e.clientY);
    show();
  };

  const onOver = (e: PointerEvent) => {
    const t = (e.target as Element | null)?.closest<HTMLElement>('a, button, [data-cursor]');
    const text = t?.dataset.cursor ?? '';
    if (label.value) label.value.textContent = text;
    root.value?.classList.toggle('is-hover', !!t);
    root.value?.classList.toggle('has-label', !!text);
    ringScale(t ? (text ? 3.2 : 1.7) : 1);
  };

  const onDown = () => ringScale(0.75);
  const onUp = () => ringScale(root.value?.classList.contains('is-hover') ? 1.7 : 1);
  const onLeave = () => hide();

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerover', onOver, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  document.documentElement.addEventListener('mouseleave', onLeave);

  cleanup = () => {
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerover', onOver);
    window.removeEventListener('pointerdown', onDown);
    window.removeEventListener('pointerup', onUp);
    document.documentElement.removeEventListener('mouseleave', onLeave);
    document.body.classList.remove('has-cursor');
  };
});

onBeforeUnmount(() => cleanup?.());
</script>

<style scoped>
.cursor {
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  mix-blend-mode: difference;
  color: #fff;
}

.cursor__dot,
.cursor__ring {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  will-change: transform;
}

.cursor__dot {
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -3px;
  background: #fff;
}

.cursor__ring {
  width: 34px;
  height: 34px;
  margin: -17px 0 0 -17px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  display: grid;
  place-items: center;
  transition: background-color 0.3s ease;
}

.cursor.is-hover .cursor__ring {
  background: rgba(255, 255, 255, 0.12);
}

.cursor.has-label .cursor__ring {
  background: #fff;
  border-color: #fff;
}

.cursor.has-label .cursor__dot {
  opacity: 0;
}

.cursor__label {
  font-size: 0.24rem;
  letter-spacing: 0.08em;
  color: #000;
  opacity: 0;
  transition: opacity 0.2s ease;
  white-space: nowrap;
}

.cursor.has-label .cursor__label {
  opacity: 1;
}
</style>
