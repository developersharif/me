<template>
  <canvas ref="cv" class="scope" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../composables/useSiteState';
import { getLenis } from '../composables/useSmoothScroll';

/**
 * A live "signal" line. Idle it breathes; it reacts to the pointer
 * (amplitude + frequency) and to scroll velocity. Only animates while
 * on screen and the tab is visible. Cheap: one 2D stroke per frame.
 */
const cv = ref<HTMLCanvasElement | null>(null);

let ctx: CanvasRenderingContext2D | null = null;
let W = 0;
let H = 0;
let dpr = 1;
let phase = 0;
let amp = 0.22;
let ampTarget = 0.22;
let freq = 2.2;
let freqTarget = 2.2;
let energy = 0;
let pointerX = 0.5;
let pointerY = 0.5;
let pointerOn = 0;
let pointerOnTarget = 0;
let lastScroll = 0;
let inView = true;
let frame = 0;
let fg = '#0f0e0c';
let accent = '#ff4f1f';
let ro: ResizeObserver | undefined;
let io: IntersectionObserver | undefined;
let running = false;

const TAU = Math.PI * 2;

function readColors() {
  const s = getComputedStyle(document.documentElement);
  fg = s.getPropertyValue('--fg').trim() || fg;
  accent = s.getPropertyValue('--accent').trim() || accent;
}

function resize() {
  const el = cv.value;
  if (!el) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = el.clientWidth;
  H = el.clientHeight;
  el.width = Math.round(W * dpr);
  el.height = Math.round(H * dpr);
  ctx = el.getContext('2d');
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawFrame();
}

function envelope(t: number) {
  // soft fade at both edges so the line "emerges" from the margins
  const e = Math.min(t, 1 - t) * 6;
  return Math.min(1, e);
}

function sample(t: number, echo = 0) {
  const p = phase + echo;
  const base = Math.sin(t * TAU * freq + p) * 0.6 + Math.sin(t * TAU * freq * 0.47 + p * 0.63) * 0.4;
  const d = t - pointerX;
  const bump = Math.exp(-(d * d) / 0.006) * pointerOn;
  const ripple = Math.sin(t * TAU * (freq * 3.1) + p * 2.4) * bump * (0.35 + (1 - pointerY) * 0.9);
  const jitter = Math.sin(t * 97.3 + p * 5.1) * 0.03 * energy;
  return (base * amp + ripple + jitter) * envelope(t);
}

function drawFrame() {
  if (!ctx || !W || !H) return;
  const c = ctx;
  c.clearRect(0, 0, W, H);
  const mid = H * 0.5;
  const scale = H * 0.38;
  const step = Math.max(2, W / 320);

  // echo line
  c.beginPath();
  c.lineWidth = 1;
  c.strokeStyle = fg;
  c.globalAlpha = 0.22;
  for (let x = 0; x <= W; x += step) {
    const y = mid + sample(x / W, -0.9) * scale;
    if (x === 0) c.moveTo(x, y);
    else c.lineTo(x, y);
  }
  c.stroke();

  // main line
  c.beginPath();
  c.lineWidth = 1.6;
  c.globalAlpha = 1;
  c.lineJoin = 'round';
  for (let x = 0; x <= W; x += step) {
    const y = mid + sample(x / W) * scale;
    if (x === 0) c.moveTo(x, y);
    else c.lineTo(x, y);
  }
  c.stroke();

  // probe
  if (pointerOn > 0.02) {
    const px = pointerX * W;
    const py = mid + sample(pointerX) * scale;
    c.globalAlpha = pointerOn;
    c.fillStyle = accent;
    c.beginPath();
    c.arc(px, py, 4, 0, TAU);
    c.fill();
    c.globalAlpha = 1;
  }
}

function tick() {
  if (!inView || document.hidden) return;
  frame++;
  if (frame % 30 === 0) readColors();

  const lenis = getLenis();
  const sy = window.scrollY;
  const v = lenis ? Math.abs(lenis.velocity) : Math.abs(sy - lastScroll);
  lastScroll = sy;
  const scrollEnergy = Math.min(1, v / 40);

  energy += (scrollEnergy - energy) * 0.12;
  pointerOn += (pointerOnTarget - pointerOn) * 0.08;
  ampTarget = 0.22 + energy * 0.5;
  amp += (ampTarget - amp) * 0.06;
  freqTarget = 2.2 + (1 - pointerY) * pointerOn * 3 + energy * 1.5;
  freq += (freqTarget - freq) * 0.05;
  phase += 0.018 + energy * 0.12 + pointerOn * 0.01;

  drawFrame();
}

function onPointerMove(e: PointerEvent) {
  const el = cv.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  pointerX = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
  const rel = (e.clientY - r.top) / r.height;
  // react to the pointer anywhere in the hero, strongest over the line
  pointerY = Math.min(1, Math.max(0, rel));
  pointerOnTarget = rel > -2.5 && rel < 2.5 ? 1 : 0;
}

function onPointerLeave() {
  pointerOnTarget = 0;
}

onMounted(() => {
  readColors();
  resize();
  ro = new ResizeObserver(resize);
  if (cv.value) ro.observe(cv.value);

  if (prefersReducedMotion()) {
    drawFrame();
    return;
  }

  io = new IntersectionObserver(
    (entries) => {
      inView = entries[0]?.isIntersecting ?? true;
    },
    { rootMargin: '80px' }
  );
  if (cv.value) io.observe(cv.value);

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('mouseleave', onPointerLeave);
  gsap.ticker.add(tick);
  running = true;
});

onBeforeUnmount(() => {
  ro?.disconnect();
  io?.disconnect();
  window.removeEventListener('pointermove', onPointerMove);
  document.documentElement.removeEventListener('mouseleave', onPointerLeave);
  if (running) gsap.ticker.remove(tick);
});
</script>

<style scoped>
.scope {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
