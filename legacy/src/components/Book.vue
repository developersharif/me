<template>
  <div
    class="book-stage"
    ref="stageRef"
    role="region"
    aria-label="Interactive portfolio book"
    tabindex="0"
  >
    <div
      class="book-shell"
      ref="shellRef"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <!-- Hardcover (back) — visible at edges around the page surface -->
      <div class="book-cover" aria-hidden="true">
        <div class="cover-leather"></div>
        <div class="cover-trim"></div>
        <div class="cover-spine">
          <div class="spine-band" v-for="i in 4" :key="i"></div>
          <div class="spine-emboss"></div>
        </div>
      </div>

      <!-- Gilded page-stack edges (gives book thickness) -->
      <div class="page-stack stack-top" aria-hidden="true"></div>
      <div class="page-stack stack-bottom" aria-hidden="true"></div>
      <div class="page-stack stack-right" aria-hidden="true"></div>

      <!-- Currently visible page -->
      <div class="page page-current">
        <div class="page-paper">
          <div class="page-gutter" aria-hidden="true"></div>
          <div
            class="page-inner"
            ref="currentScrollRef"
            @scroll="onScroll"
          >
            <component
              :is="currentPage?.component"
              v-bind="currentPage?.props"
              v-if="currentPage"
            />
          </div>
          <div
            v-show="canFlipForward"
            class="corner-hint forward"
            aria-hidden="true"
          ></div>
          <div
            v-show="canFlipBackward"
            class="corner-hint backward"
            aria-hidden="true"
          ></div>
        </div>
      </div>

      <!-- Flipping page overlay (only while flipping) -->
      <div
        v-if="isFlipping"
        class="page page-flipping"
        ref="flipPageRef"
        :class="{ 'mid-passed': midPassed }"
        aria-hidden="true"
      >
        <div class="flip-paper">
          <div class="page-gutter" aria-hidden="true"></div>
          <div class="page-inner static side-front" v-show="!midPassed">
            <component
              :is="frontContent?.component"
              v-bind="frontContent?.props"
              v-if="frontContent"
            />
          </div>
          <div class="page-inner static side-back" v-show="midPassed">
            <component
              :is="backContent?.component"
              v-bind="backContent?.props"
              v-if="backContent"
            />
          </div>
          <div class="curl-shadow" aria-hidden="true"></div>
          <div class="curl-gloss" aria-hidden="true"></div>
          <div class="curl-edge" aria-hidden="true"></div>
        </div>
      </div>
    </div>

    <!-- Side nav -->
    <button
      v-show="canFlipBackward"
      class="side-btn prev"
      @click="prevPage"
      aria-label="Previous page"
    >
      ‹
    </button>
    <button
      v-show="canFlipForward"
      class="side-btn next"
      @click="nextPage"
      aria-label="Next page"
    >
      ›
    </button>

    <!-- Page indicator -->
    <transition name="indicator">
      <div v-if="indicator.visible" class="page-indicator">
        <span class="indicator-dir">{{ indicator.dir }}</span>
        <span class="indicator-title">{{ indicator.title }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';

interface Page {
  id: string;
  component: any;
  label?: string;
  props?: Record<string, any>;
}

const props = defineProps<{ pages: Page[] }>();

// State
const currentPageIndex = ref(0);
const isFlipping = ref(false);
const midPassed = ref(false);
const frontContent = ref<Page | null>(null);
const backContent = ref<Page | null>(null);

// Refs
const stageRef = ref<HTMLElement | null>(null);
const shellRef = ref<HTMLElement | null>(null);
const flipPageRef = ref<HTMLElement | null>(null);
const currentScrollRef = ref<HTMLElement | null>(null);

const isMobile = ref(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
const prefersReducedMotion = ref(
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

const currentPage = computed(() => props.pages[currentPageIndex.value]);
const canFlipForward = computed(
  () => currentPageIndex.value < props.pages.length - 1 && !isFlipping.value
);
const canFlipBackward = computed(
  () => currentPageIndex.value > 0 && !isFlipping.value
);

// Indicator
const indicator = ref({ visible: false, dir: '', title: '' });
let indicatorTimer: number | null = null;
function showIndicator(dir: 'forward' | 'backward', targetIdx: number) {
  const target = props.pages[targetIdx];
  indicator.value = {
    visible: true,
    dir: dir === 'forward' ? 'Next' : 'Previous',
    title: target?.label || `Page ${targetIdx + 1}`,
  };
  if (indicatorTimer) window.clearTimeout(indicatorTimer);
  indicatorTimer = window.setTimeout(() => {
    indicator.value.visible = false;
  }, 1100);
}

// ---------- Flip core ----------

function setFlipContent(direction: 'forward' | 'backward', targetIdx?: number) {
  if (direction === 'forward') {
    frontContent.value = props.pages[currentPageIndex.value];
    backContent.value = props.pages[targetIdx ?? currentPageIndex.value + 1];
  } else {
    frontContent.value = props.pages[targetIdx ?? currentPageIndex.value - 1];
    backContent.value = props.pages[currentPageIndex.value];
  }
}

function applyAngle(el: HTMLElement, angle: number) {
  // angle is 0 → -180
  const absP = Math.abs(angle) / 180; // 0..1
  const peak = 1 - Math.abs(absP - 0.5) * 2; // 0..1..0
  // Subtle "bowing" — page squishes at midpoint to suggest curl thickness
  const squish = 1 - peak * 0.05;
  gsap.set(el, { rotateY: angle, scaleY: squish, force3D: true });
  el.style.setProperty('--peak', peak.toFixed(3));
  el.style.setProperty('--p', absP.toFixed(3));
  midPassed.value = absP > 0.5;
}

function resetFlipState() {
  isFlipping.value = false;
  frontContent.value = null;
  backContent.value = null;
  midPassed.value = false;
}

async function flipTo(
  direction: 'forward' | 'backward',
  targetIdx?: number,
  duration?: number
): Promise<void> {
  if (isFlipping.value) return;
  const idx =
    targetIdx ??
    (direction === 'forward'
      ? currentPageIndex.value + 1
      : currentPageIndex.value - 1);
  if (idx < 0 || idx >= props.pages.length) return;

  showIndicator(direction, idx);

  if (prefersReducedMotion.value) {
    currentPageIndex.value = idx;
    nextTick(() => currentScrollRef.value?.scrollTo({ top: 0 }));
    return;
  }

  isFlipping.value = true;
  midPassed.value = false;
  setFlipContent(direction, idx);

  await nextTick();
  const el = flipPageRef.value;
  if (!el) {
    currentPageIndex.value = idx;
    resetFlipState();
    return;
  }

  const startAngle = direction === 'forward' ? 0 : -180;
  const endAngle = direction === 'forward' ? -180 : 0;
  applyAngle(el, startAngle);

  return new Promise<void>((resolve) => {
    const state = { angle: startAngle };
    gsap.to(state, {
      angle: endAngle,
      duration: duration ?? (isMobile.value ? 0.7 : 0.95),
      ease: 'power2.inOut',
      onUpdate: () => applyAngle(el, state.angle),
      onComplete: () => {
        currentPageIndex.value = idx;
        resetFlipState();
        nextTick(() => {
          currentScrollRef.value?.scrollTo({ top: 0, behavior: 'auto' });
          resolve();
        });
      },
    });
  });
}

const nextPage = () => flipTo('forward');
const prevPage = () => flipTo('backward');

// ---------- goTo ----------
type GoToMode = 'step' | 'fast' | 'instant';
async function goTo(index: number, opts?: { mode?: GoToMode }) {
  const target = Math.max(0, Math.min(index, props.pages.length - 1));
  if (target === currentPageIndex.value || isFlipping.value) return;
  const mode: GoToMode = opts?.mode ?? 'fast';
  const direction: 'forward' | 'backward' =
    target > currentPageIndex.value ? 'forward' : 'backward';

  if (mode === 'instant' || prefersReducedMotion.value) {
    showIndicator(direction, target);
    currentPageIndex.value = target;
    nextTick(() => currentScrollRef.value?.scrollTo({ top: 0 }));
    return;
  }

  if (mode === 'fast') {
    // Single visual flip that jumps directly to target
    await flipTo(direction, target, 0.65);
    return;
  }

  // Step mode — chain individual flips
  while (currentPageIndex.value !== target) {
    if (direction === 'forward' && currentPageIndex.value >= props.pages.length - 1) break;
    if (direction === 'backward' && currentPageIndex.value <= 0) break;
    await flipTo(direction);
  }
}

// ---------- Drag ----------

const drag = ref({
  active: false,
  direction: null as null | 'forward' | 'backward',
  startX: 0,
  currentX: 0,
  width: 0,
  lastTs: 0,
  velocity: 0,
  progress: 0,
});

function isInteractiveElement(el: HTMLElement | null): boolean {
  if (!el) return false;
  return !!el.closest(
    'a, button, input, textarea, select, label, summary, details, [role="button"], [role="link"], [contenteditable="true"], .no-flip, [data-no-flip], [data-interactive]'
  );
}

function eventTargetsInteractive(e: Event): boolean {
  try {
    const sel = window.getSelection?.();
    if (sel && sel.toString().length > 0) return true;
  } catch {}
  const path = (e.composedPath?.() || []) as EventTarget[];
  for (const t of path) {
    if (t instanceof HTMLElement && isInteractiveElement(t)) return true;
  }
  return isInteractiveElement(e.target as HTMLElement);
}

function startDrag(
  direction: 'forward' | 'backward',
  startX: number,
  e: PointerEvent,
  width: number
) {
  drag.value = {
    active: true,
    direction,
    startX,
    currentX: startX,
    width,
    lastTs: Date.now(),
    velocity: 0,
    progress: 0,
  };
  isFlipping.value = true;
  midPassed.value = false;
  setFlipContent(direction);
  try { (e.target as Element).setPointerCapture?.(e.pointerId); } catch {}
  nextTick(() => {
    const el = flipPageRef.value;
    if (el) applyAngle(el, direction === 'forward' ? 0 : -180);
  });
}

function onPointerDown(e: PointerEvent) {
  if (isFlipping.value || prefersReducedMotion.value) return;
  if (eventTargetsInteractive(e)) return;
  const rect = shellRef.value?.getBoundingClientRect();
  if (!rect) return;
  const localX = e.clientX - rect.left;
  const w = rect.width;
  const right = localX > w * 0.72;
  const left = localX < w * 0.28;
  if (right && currentPageIndex.value < props.pages.length - 1) {
    startDrag('forward', e.clientX, e, w);
  } else if (left && currentPageIndex.value > 0) {
    startDrag('backward', e.clientX, e, w);
  }
}

function onPointerMove(e: PointerEvent) {
  if (!drag.value.active) return;
  const now = Date.now();
  const dt = now - drag.value.lastTs;
  const dx = e.clientX - drag.value.currentX;
  drag.value.currentX = e.clientX;
  drag.value.velocity = dt > 0 ? dx / dt : 0;
  drag.value.lastTs = now;

  const dist = drag.value.currentX - drag.value.startX;
  const maxDrag = drag.value.width * 0.85;
  let p = 0;
  if (drag.value.direction === 'forward') {
    p = Math.max(0, Math.min(1, -dist / maxDrag));
  } else {
    p = Math.max(0, Math.min(1, dist / maxDrag));
  }
  drag.value.progress = p;

  const el = flipPageRef.value;
  if (!el) return;
  const angle =
    drag.value.direction === 'forward' ? -180 * p : -180 + 180 * p;
  applyAngle(el, angle);
}

function onPointerUp(e: PointerEvent) {
  if (!drag.value.active) return;
  drag.value.active = false;
  try { (e.target as Element).releasePointerCapture?.(e.pointerId); } catch {}

  const { progress: p, velocity: v, direction: dir } = drag.value;
  const finish =
    dir === 'forward'
      ? p > 0.3 || v < -0.5
      : p > 0.3 || v > 0.5;

  const el = flipPageRef.value;
  if (!el) {
    resetFlipState();
    return;
  }

  const currentAngle =
    dir === 'forward' ? -180 * p : -180 + 180 * p;
  const endAngle =
    dir === 'forward' ? (finish ? -180 : 0) : finish ? 0 : -180;

  const state = { angle: currentAngle };
  gsap.to(state, {
    angle: endAngle,
    duration: 0.35,
    ease: 'power2.out',
    onUpdate: () => applyAngle(el, state.angle),
    onComplete: () => {
      if (finish) {
        currentPageIndex.value =
          dir === 'forward'
            ? currentPageIndex.value + 1
            : currentPageIndex.value - 1;
        nextTick(() => currentScrollRef.value?.scrollTo({ top: 0 }));
      }
      resetFlipState();
    },
  });
}

// ---------- Keyboard / wheel ----------

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
    e.preventDefault();
    nextPage();
  } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
    e.preventDefault();
    prevPage();
  } else if (e.key === 'Home') {
    e.preventDefault();
    goTo(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    goTo(props.pages.length - 1);
  }
}

function onWheel(e: WheelEvent) {
  if (!e.ctrlKey || isMobile.value || isFlipping.value || drag.value.active) return;
  e.preventDefault();
  if (e.deltaY > 0) nextPage();
  else if (e.deltaY < 0) prevPage();
}

function onScroll(_e: Event) {
  // Reserved for future scroll-based UI hooks
}

// ---------- Lifecycle ----------

const onResize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  const stage = stageRef.value;
  if (stage) {
    stage.addEventListener('keydown', onKeydown);
    stage.addEventListener('wheel', onWheel as any, { passive: false });
    stage.style.touchAction = 'pan-y';
  }
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  const stage = stageRef.value;
  if (stage) {
    stage.removeEventListener('keydown', onKeydown);
    stage.removeEventListener('wheel', onWheel as any);
  }
  window.removeEventListener('resize', onResize);
  if (indicatorTimer) window.clearTimeout(indicatorTimer);
});

defineExpose({ goTo, nextPage, prevPage, currentPageIndex });
</script>

<style scoped>
/* ============================
   BOOK STAGE
   ============================ */
.book-stage {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 2.25rem;
  perspective: 2400px;
  perspective-origin: 50% 42%;
  outline: none;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
}

/* ============================
   BOOK SHELL — open hardcover body
   ============================ */
.book-shell {
  position: relative;
  width: 100%;
  max-width: 880px;
  height: 100%;
  max-height: 100%;
  aspect-ratio: 3 / 4;
  margin: 0 auto;
  transform-style: preserve-3d;
  transform: rotateX(3deg);
  filter: drop-shadow(0 40px 36px rgba(0, 0, 0, 0.55))
          drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
}

/* Let the shell grow taller when room allows */
@media (min-aspect-ratio: 4/5) {
  .book-shell { aspect-ratio: auto; }
}

/* ============================
   HARDCOVER (leather back + spine)
   ============================ */
.book-cover {
  position: absolute;
  inset: -16px -14px -16px -26px;
  border-radius: 4px 12px 12px 4px;
  z-index: 1;
  overflow: hidden;
  box-shadow:
    inset 0 0 0 1px rgba(212, 175, 55, 0.18),
    inset 0 0 60px rgba(0, 0, 0, 0.6);
}

.cover-leather {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 100% at 50% 0%, rgba(255, 200, 140, 0.06) 0%, transparent 60%),
    radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.04) 0, transparent 45%),
    radial-gradient(circle at 75% 70%, rgba(0, 0, 0, 0.25) 0, transparent 50%),
    linear-gradient(135deg, #3a2418 0%, #221208 45%, #160a05 100%);
  background-blend-mode: normal;
}

.cover-leather::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      27deg,
      transparent 0 2px,
      rgba(0, 0, 0, 0.04) 2px 3px
    ),
    repeating-linear-gradient(
      -63deg,
      transparent 0 3px,
      rgba(255, 255, 255, 0.012) 3px 4px
    );
  mix-blend-mode: overlay;
  opacity: 0.7;
}

.cover-trim {
  position: absolute;
  inset: 8px 8px 8px 32px;
  border-radius: 2px 8px 8px 2px;
  border: 1px solid rgba(212, 175, 55, 0.25);
  box-shadow:
    inset 0 0 0 2px rgba(0, 0, 0, 0.25),
    inset 0 0 12px rgba(212, 175, 55, 0.06);
  pointer-events: none;
}

/* Spine — protrudes on the left side of the cover */
.cover-spine {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 26px;
  background:
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.35) 35%,
      rgba(0, 0, 0, 0.1) 70%,
      rgba(0, 0, 0, 0.45) 100%
    ),
    linear-gradient(135deg, #2a160c 0%, #1a0a04 100%);
  box-shadow:
    inset -2px 0 0 rgba(0, 0, 0, 0.5),
    inset 1px 0 0 rgba(255, 200, 140, 0.08);
}

.spine-band {
  position: absolute;
  left: 2px;
  right: 2px;
  height: 8px;
  background:
    linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25));
  box-shadow:
    0 1px 0 rgba(212, 175, 55, 0.15),
    0 -1px 0 rgba(212, 175, 55, 0.12),
    inset 0 0 3px rgba(0, 0, 0, 0.4);
  border-radius: 1px;
}
.spine-band:nth-child(1) { top: 15%; }
.spine-band:nth-child(2) { top: 38%; }
.spine-band:nth-child(3) { top: 60%; }
.spine-band:nth-child(4) { top: 82%; }

.spine-emboss {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
  font-size: 8px;
  letter-spacing: 0.4em;
  color: rgba(212, 175, 55, 0.35);
  white-space: nowrap;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.6);
  pointer-events: none;
  font-family: 'Georgia', serif;
  font-weight: 600;
}

/* ============================
   PAGE STACK (gilded edges)
   ============================ */
.page-stack {
  position: absolute;
  pointer-events: none;
  z-index: 2;
}

.stack-right {
  top: 4px;
  bottom: 4px;
  right: -7px;
  width: 7px;
  border-radius: 0 2px 2px 0;
  background:
    repeating-linear-gradient(
      to bottom,
      #c8a14a 0px,
      #c8a14a 1px,
      #8b6a28 1px,
      #8b6a28 2.2px
    );
  box-shadow:
    inset -1px 0 0 rgba(0, 0, 0, 0.35),
    -1px 0 8px rgba(0, 0, 0, 0.35);
}

.stack-top {
  top: -7px;
  left: 24px;
  right: 0;
  height: 7px;
  border-radius: 2px 2px 0 0;
  background:
    repeating-linear-gradient(
      to right,
      #c8a14a 0px,
      #c8a14a 1px,
      #8b6a28 1px,
      #8b6a28 2.2px
    );
  box-shadow:
    inset 0 -1px 0 rgba(0, 0, 0, 0.3),
    0 -1px 6px rgba(0, 0, 0, 0.35);
}

.stack-bottom {
  bottom: -7px;
  left: 24px;
  right: 0;
  height: 7px;
  border-radius: 0 0 2px 2px;
  background:
    repeating-linear-gradient(
      to right,
      #c8a14a 0px,
      #c8a14a 1px,
      #8b6a28 1px,
      #8b6a28 2.2px
    );
  box-shadow:
    inset 0 1px 0 rgba(0, 0, 0, 0.3),
    0 6px 12px rgba(0, 0, 0, 0.35);
}

/* ============================
   PAGE SURFACE (current)
   ============================ */
.page {
  position: absolute;
  inset: 0;
  z-index: 3;
}

.page-paper {
  position: absolute;
  inset: 0;
  border-radius: 2px 8px 8px 2px;
  overflow: hidden;
  background:
    radial-gradient(120% 100% at 100% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 55%),
    linear-gradient(135deg, #11172a 0%, #0b1020 50%, #080d1a 100%);
  box-shadow:
    inset 0 0 0 1px rgba(212, 175, 55, 0.08),
    inset 24px 0 36px -24px rgba(0, 0, 0, 0.7);
}

/* Subtle parchment grain — kept very light, doesn't fight content */
.page-paper::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 22% 30%, rgba(255, 255, 255, 0.025) 0, transparent 45%),
    radial-gradient(circle at 78% 70%, rgba(255, 255, 255, 0.018) 0, transparent 45%);
  mix-blend-mode: screen;
  opacity: 0.7;
}

/* Gutter shadow near the spine */
.page-gutter {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 36px;
  pointer-events: none;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.28) 35%,
    rgba(0, 0, 0, 0.1) 70%,
    transparent 100%
  );
  z-index: 4;
}

.page-inner {
  position: absolute;
  inset: 0;
  padding: 2rem 2rem 2rem 3rem;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(212, 175, 55, 0.3) transparent;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  z-index: 3;
}
.page-inner.static { overflow: hidden; }
.page-inner::-webkit-scrollbar { width: 6px; }
.page-inner::-webkit-scrollbar-track { background: transparent; }
.page-inner::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3);
  border-radius: 3px;
}
.page-inner::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.55); }

/* ============================
   FLIPPING PAGE OVERLAY
   ============================ */
.page-flipping {
  z-index: 10;
  transform-origin: 0% 50%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  will-change: transform;
  --peak: 0;
  --p: 0;
}

.flip-paper {
  position: absolute;
  inset: 0;
  border-radius: 2px 8px 8px 2px;
  overflow: hidden;
  background:
    radial-gradient(120% 100% at 100% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 55%),
    linear-gradient(135deg, #11172a 0%, #0b1020 50%, #080d1a 100%);
  box-shadow:
    inset 0 0 0 1px rgba(212, 175, 55, 0.08),
    inset 24px 0 36px -24px rgba(0, 0, 0, 0.7);
}

/* Back side is mirrored so it reads correctly through the rotation */
.side-back {
  transform: scaleX(-1);
  transform-origin: center;
}

/* Curl shading — darkens the page underside as it lifts */
.curl-shadow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  z-index: 8;
  opacity: calc(var(--peak, 0) * 0.7);
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.32) 28%,
    rgba(0, 0, 0, 0.1) 60%,
    transparent 100%
  );
  transition: none;
}

/* Light reflecting off the curl */
.curl-gloss {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  z-index: 9;
  opacity: calc(var(--peak, 0) * 0.55);
  background: linear-gradient(
    100deg,
    transparent 30%,
    rgba(255, 240, 210, 0.06) 45%,
    rgba(255, 240, 210, 0.16) 52%,
    rgba(255, 240, 210, 0.06) 60%,
    transparent 75%
  );
  mix-blend-mode: screen;
  transition: none;
}

/* Visible page-edge thickness during flip */
.curl-edge {
  position: absolute;
  top: 2%;
  bottom: 2%;
  right: -2px;
  width: 3px;
  pointer-events: none;
  opacity: calc(var(--peak, 0) * 0.9);
  background: linear-gradient(
    to bottom,
    rgba(200, 161, 74, 0.3),
    rgba(200, 161, 74, 0.7) 50%,
    rgba(200, 161, 74, 0.3)
  );
  border-radius: 0 2px 2px 0;
  z-index: 11;
  filter: blur(0.4px);
}

/* When flip passes the midpoint, swap gradient orientations (back face) */
.page-flipping.mid-passed .curl-shadow {
  background: linear-gradient(
    to left,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.32) 28%,
    rgba(0, 0, 0, 0.1) 60%,
    transparent 100%
  );
}
.page-flipping.mid-passed .curl-gloss {
  background: linear-gradient(
    260deg,
    transparent 30%,
    rgba(255, 240, 210, 0.06) 45%,
    rgba(255, 240, 210, 0.16) 52%,
    rgba(255, 240, 210, 0.06) 60%,
    transparent 75%
  );
}
.page-flipping.mid-passed .curl-edge {
  right: auto;
  left: -2px;
  border-radius: 2px 0 0 2px;
}

/* ============================
   CORNER HINTS
   ============================ */
.corner-hint {
  position: absolute;
  width: 56px;
  height: 56px;
  pointer-events: none;
  z-index: 5;
  opacity: 0.4;
  transition: opacity 0.25s ease;
}

.corner-hint.forward {
  right: 0;
  bottom: 0;
  background:
    linear-gradient(
      225deg,
      rgba(212, 175, 55, 0.25) 0%,
      rgba(212, 175, 55, 0.08) 35%,
      transparent 55%
    );
  border-radius: 0 0 8px 0;
  box-shadow: inset -1px -1px 0 rgba(212, 175, 55, 0.2);
}

.corner-hint.backward {
  left: 0;
  bottom: 0;
  background:
    linear-gradient(
      135deg,
      rgba(212, 175, 55, 0.2) 0%,
      rgba(212, 175, 55, 0.06) 35%,
      transparent 55%
    );
  border-radius: 0 0 0 2px;
}

.book-shell:hover .corner-hint { opacity: 0.85; }

/* ============================
   SIDE NAV
   ============================ */
.side-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background:
    linear-gradient(135deg, rgba(212, 175, 55, 0.22), rgba(212, 175, 55, 0.08)),
    rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(212, 175, 55, 0.4);
  color: rgba(255, 235, 200, 0.95);
  font-size: 1.6rem;
  font-weight: 300;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  z-index: 40;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  backdrop-filter: blur(6px);
  font-family: 'Georgia', serif;
}

.side-btn:hover {
  transform: translateY(-50%) scale(1.08);
  background:
    linear-gradient(135deg, rgba(212, 175, 55, 0.35), rgba(212, 175, 55, 0.15)),
    rgba(0, 0, 0, 0.65);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(212, 175, 55, 0.2);
}

.side-btn:active { transform: translateY(-50%) scale(0.96); }
.side-btn.prev { left: 0.25rem; }
.side-btn.next { right: 0.25rem; }

@media (min-width: 768px) {
  .side-btn { width: 52px; height: 52px; font-size: 1.9rem; }
  .side-btn.prev { left: 0.5rem; }
  .side-btn.next { right: 0.5rem; }
}

/* ============================
   PAGE INDICATOR
   ============================ */
.page-indicator {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(8, 12, 24, 0.88);
  border: 1px solid rgba(212, 175, 55, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 999px;
  padding: 0.45rem 1rem;
  color: rgba(255, 235, 200, 0.95);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  z-index: 45;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.indicator-dir {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(212, 175, 55, 0.8);
}

.indicator-title { font-weight: 600; }

.indicator-enter-active,
.indicator-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.indicator-enter-from,
.indicator-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}

/* ============================
   RESPONSIVE
   ============================ */
@media (max-width: 767px) {
  .book-stage { padding: 0.5rem 1.5rem; perspective: 1600px; }
  .book-shell {
    aspect-ratio: auto;
    max-width: 100%;
    transform: none;
    filter: drop-shadow(0 18px 18px rgba(0, 0, 0, 0.5));
  }
  .book-cover { inset: -10px -8px -10px -16px; }
  .cover-spine { width: 16px; }
  .stack-right { right: -5px; width: 5px; }
  .stack-top, .stack-bottom { left: 14px; height: 5px; }
  .stack-top { top: -5px; }
  .stack-bottom { bottom: -5px; }
  .page-inner { padding: 1.5rem 1rem 1.5rem 1.75rem; }
  .page-gutter { width: 22px; }
  .corner-hint { width: 38px; height: 38px; }
}

/* ============================
   REDUCED MOTION
   ============================ */
@media (prefers-reduced-motion: reduce) {
  .book-shell { filter: drop-shadow(0 12px 14px rgba(0, 0, 0, 0.4)); }
  .page-flipping { display: none !important; }
  .indicator-enter-active,
  .indicator-leave-active { transition-duration: 0.12s; }
}
</style>
