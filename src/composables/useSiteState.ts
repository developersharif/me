import { reactive } from 'vue';

/** Tiny shared state for the single-page site. */
export const site = reactive({
  activeSection: '',
  menuOpen: false,
  introDone: false,
  ready: false,
});

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
