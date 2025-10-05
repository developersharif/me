<template>
  <div
    class="relative magical-portal cursor-pointer group"
    :style="{ '--sparkle-intensity': sparkleIntensity, '--magic-progress': magicLevel / 10 }"
    @mouseenter="$emit('enter')"
    @mouseleave="$emit('leave')"
    @click="$emit('click')"
  >
    <!-- Ambient glow backdrop -->
    <div class="portal-backdrop"></div>

    <!-- Magic progress halo -->
    <div v-if="magicLevel > 0" class="portal-progress-halo">
      <svg viewBox="0 0 200 200" class="w-full h-full">
        <defs>
          <linearGradient id="portalProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(147, 51, 234, 0.25)" />
            <stop offset="50%" stop-color="rgba(79, 70, 229, 0.65)" />
            <stop offset="100%" stop-color="rgba(236, 72, 153, 0.9)" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(147, 51, 234, 0.1)" stroke-width="2" />
        <circle
          class="portal-progress-stroke"
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="url(#portalProgressGrad)"
          stroke-width="4"
          stroke-linecap="round"
          :stroke-dasharray="578"
          :stroke-dashoffset="578 - (578 * magicLevel / 10)"
        />
      </svg>
    </div>

    <!-- Floating energy ribbons -->
    <div class="portal-ribbons">
      <div class="portal-ribbon ribbon-1"></div>
      <div class="portal-ribbon ribbon-2"></div>
      <div class="portal-ribbon ribbon-3"></div>
    </div>

    <!-- Orbiting glyphs -->
    <div class="portal-orbit">
      <div class="orbit-ring ring-1"></div>
      <div class="orbit-ring ring-2"></div>
      <div class="orbit-ring ring-3"></div>
      <div
        v-for="(symbol, i) in symbols"
        :key="`orbit-symbol-${i}`"
        class="orbiting-symbol"
        :style="{
          '--orbit-angle': (i * (360 / Math.max(symbols.length, 1))) + 'deg',
          '--orbit-delay': i * 0.35 + 's'
        }"
        @mouseenter="$emit('symbol-hover', i)"
      >
        <span class="symbol-glyph">{{ symbol }}</span>
      </div>
    </div>

    <!-- Energy pedestal -->
    <div class="portal-pedestal">
      <div class="pedestal-glow"></div>
      <div class="pedestal-base">
        <div class="pedestal-layer layer-1"></div>
        <div class="pedestal-layer layer-2"></div>
        <div class="pedestal-layer layer-3"></div>
      </div>
      <div class="pedestal-rings">
        <div class="pedestal-ring ring-1"></div>
        <div class="pedestal-ring ring-2"></div>
        <div class="pedestal-ring ring-3"></div>
      </div>
      <div class="pedestal-particles">
        <div v-for="i in 8" :key="`ped-particle-${i}`" class="ped-particle" :style="{ '--ped-angle': (i * 45) + 'deg' }"></div>
      </div>
    </div>

    <!-- Cosmic energy sphere centerpiece -->
    <div class="portal-sphere">
      <!-- Outer energy shields -->
      <div class="sphere-shields">
        <div class="energy-shield shield-1"></div>
        <div class="energy-shield shield-2"></div>
        <div class="energy-shield shield-3"></div>
      </div>
      
      <!-- Cosmic aurora background -->
      <div class="sphere-aurora"></div>
      
      <!-- Geometric wireframe -->
      <div class="sphere-wireframe">
        <svg viewBox="0 0 100 100" class="wireframe-svg">
          <circle cx="50" cy="50" r="40" class="wire-circle c1" />
          <circle cx="50" cy="50" r="30" class="wire-circle c2" />
          <circle cx="50" cy="50" r="20" class="wire-circle c3" />
          <line x1="10" y1="50" x2="90" y2="50" class="wire-line l1" />
          <line x1="50" y1="10" x2="50" y2="90" class="wire-line l2" />
          <line x1="20" y1="20" x2="80" y2="80" class="wire-line l3" />
          <line x1="80" y1="20" x2="20" y2="80" class="wire-line l4" />
        </svg>
      </div>
      
      <!-- Main sphere body -->
      <div class="sphere-body">
        <div class="sphere-gradient layer-1"></div>
        <div class="sphere-gradient layer-2"></div>
        <div class="sphere-gradient layer-3"></div>
      </div>
      
      <!-- Animated runes -->
      <div class="sphere-runes">
        <div class="rune rune-1">◈</div>
        <div class="rune rune-2">◇</div>
        <div class="rune rune-3">◆</div>
        <div class="rune rune-4">◉</div>
        <div class="rune rune-5">⬢</div>
        <div class="rune rune-6">⬡</div>
      </div>
      
      <!-- Core with DNA helix effect -->
      <div class="sphere-core">
        <div class="core-helix helix-1"></div>
        <div class="core-helix helix-2"></div>
        <div class="core-center"></div>
      </div>
      
      <!-- Energy waves -->
      <div class="sphere-waves">
        <div class="energy-wave wave-1"></div>
        <div class="energy-wave wave-2"></div>
        <div class="energy-wave wave-3"></div>
      </div>
      
      <!-- Particle burst system -->
      <div class="sphere-particles">
        <div v-for="i in 12" :key="`burst-${i}`" class="burst-particle" :style="{ '--burst-angle': (i * 30) + 'deg' }"></div>
      </div>
      
      <!-- Floating energy orbs -->
      <div class="sphere-orbs">
        <div class="energy-orb orb-1"></div>
        <div class="energy-orb orb-2"></div>
        <div class="energy-orb orb-3"></div>
      </div>
    </div>

    <!-- Sparkling particles -->
    <div class="portal-sparkles">
      <div
        v-for="i in 8"
        :key="`sparkle-node-${i}`"
        class="sparkle-node"
        :style="{
          '--sparkle-angle': (i * 45) + 'deg',
          '--sparkle-delay': i * 0.2 + 's'
        }"
        @mouseenter="$emit('sparkle-hover', i)"
      >
        <span class="sparkle-glyph">{{ sparkleSymbols[i % sparkleSymbols.length] }}</span>
      </div>
    </div>

    <!-- Ambient particles -->
    <div class="portal-ambient">
      <div v-for="i in 6" :key="`ambient-${i}`" class="ambient-particle" :style="{ '--ambient-index': i }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ symbols: string[]; sparkleSymbols: string[]; sparkleIntensity: number | string; magicLevel: number }>();
defineEmits<{ (e: 'enter'): void; (e: 'leave'): void; (e: 'click'): void; (e: 'symbol-hover', i: number): void; (e: 'sparkle-hover', i: number): void }>();
</script>

<style scoped>
.magical-portal {
  position: relative;
  width: 10rem;
  height: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 900px;
  transform-style: preserve-3d;
  isolation: isolate;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), filter 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  filter: drop-shadow(0 0 24px rgba(59, 130, 246, 0.18));
  will-change: transform, filter;
}

.magical-portal:hover {
  transform: translateY(-6px) scale(1.04);
  filter: drop-shadow(0 0 45px rgba(147, 51, 234, 0.55));
}

.portal-backdrop {
  position: absolute;
  inset: -18%;
  border-radius: 9999px;
  background: radial-gradient(circle at 50% 35%, rgba(147, 51, 234, 0.55), rgba(59, 130, 246, 0.18) 45%, transparent 75%);
  filter: blur(16px);
  opacity: calc(0.75 + (var(--magic-progress, 0) * 0.25));
  animation: portal-backdrop-pulse 6s ease-in-out infinite;
  pointer-events: none;
}

.portal-progress-halo {
  position: absolute;
  inset: -12%;
  pointer-events: none;
  animation: portal-halo-drift 14s linear infinite;
}

.portal-progress-halo svg {
  display: block;
  transform: rotate(-90deg);
  filter: drop-shadow(0 0 28px rgba(147, 51, 234, 0.35));
}

.portal-progress-stroke {
  transition: stroke-dashoffset 0.65s ease, stroke 0.65s ease;
}

.portal-ribbons {
  position: absolute;
  inset: 12% 10% 18%;
  pointer-events: none;
  transform-style: preserve-3d;
}

.portal-ribbon {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(from 0deg, rgba(147, 51, 234, 0.45), rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.45));
  mix-blend-mode: screen;
  opacity: 0.4;
  filter: blur(0.6px);
  animation: portal-ribbon-pulse 8s ease-in-out infinite;
}

.portal-ribbon.ribbon-1 {
  transform: rotateX(62deg) rotateZ(12deg) scale(0.92);
}

.portal-ribbon.ribbon-2 {
  transform: rotateX(70deg) rotateZ(-28deg) scale(0.82);
  animation-delay: 1.2s;
  opacity: 0.32;
}

.portal-ribbon.ribbon-3 {
  transform: rotateX(58deg) rotateZ(42deg) scale(1.05);
  animation-delay: 2.4s;
  opacity: 0.28;
}

.portal-orbit {
  position: absolute;
  inset: -6%;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.orbit-ring {
  --orbit-scale: 1;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px dashed rgba(147, 51, 234, 0.26);
  animation: orbit-spin 18s linear infinite;
  will-change: transform;
}

.orbit-ring.ring-2 {
  --orbit-scale: 0.82;
  animation-duration: 14s;
  animation-direction: reverse;
  opacity: 0.6;
}

.orbit-ring.ring-3 {
  --orbit-scale: 0.64;
  animation-duration: 10s;
  opacity: 0.45;
}

.orbiting-symbol {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  padding: 0.35rem 0.45rem;
  border-radius: 12px;
  background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.9), rgba(168, 85, 247, 0.45), transparent 85%);
  box-shadow: 0 0 16px rgba(147, 51, 234, 0.55);
  color: rgba(236, 72, 153, 0.95);
  transform-origin: center;
  transform: rotate(var(--orbit-angle, 0deg)) translateY(-4.4rem) rotate(calc(-1 * var(--orbit-angle, 0deg)));
  animation: glyph-orbit 9s linear infinite;
  animation-delay: var(--orbit-delay, 0s);
  pointer-events: auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  will-change: transform;
}

.orbiting-symbol:hover {
  transform: rotate(var(--orbit-angle, 0deg)) translateY(-4.4rem) rotate(calc(-1 * var(--orbit-angle, 0deg))) scale(1.15);
  box-shadow: 0 0 24px rgba(236, 72, 153, 0.75);
}

.symbol-glyph {
  font-size: 1rem;
  text-shadow: 0 0 12px rgba(147, 51, 234, 0.8);
}

.portal-pedestal {
  position: absolute;
  bottom: 2%;
  width: 6.5rem;
  height: 3rem;
  display: grid;
  place-items: center;
  pointer-events: none;
  transform-style: preserve-3d;
  perspective: 400px;
}

.pedestal-glow {
  position: absolute;
  inset: -40% -20% -60%;
  background: radial-gradient(ellipse at center, rgba(147, 51, 234, 0.5), rgba(236, 72, 153, 0.3) 40%, transparent 70%);
  filter: blur(25px);
  opacity: calc(0.6 + (var(--magic-progress, 0) * 0.4));
  animation: pedestal-glow-pulse 3s ease-in-out infinite;
}

.pedestal-base {
  position: relative;
  width: 100%;
  height: 100%;
  transform: rotateX(60deg);
  transform-style: preserve-3d;
}

.pedestal-layer {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.4) 50%, transparent 75%);
  border: 1px solid rgba(147, 51, 234, 0.5);
  box-shadow: 0 0 20px rgba(147, 51, 234, 0.6), inset 0 0 15px rgba(236, 72, 153, 0.4);
  animation: pedestal-layer-pulse 4s ease-in-out infinite;
}

.pedestal-layer.layer-1 {
  transform: translateZ(0px) scale(1);
}

.pedestal-layer.layer-2 {
  transform: translateZ(-3px) scale(0.85);
  opacity: 0.7;
  animation-delay: 0.5s;
}

.pedestal-layer.layer-3 {
  transform: translateZ(-6px) scale(0.7);
  opacity: 0.5;
  animation-delay: 1s;
}

.pedestal-rings {
  position: absolute;
  inset: -15%;
  pointer-events: none;
}

.pedestal-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(236, 72, 153, 0.5);
  filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.6));
  animation: pedestal-ring-rotate 8s linear infinite;
}

.pedestal-ring.ring-1 {
  opacity: 0.6;
}

.pedestal-ring.ring-2 {
  inset: 8%;
  animation-duration: 6s;
  animation-direction: reverse;
  opacity: 0.5;
}

.pedestal-ring.ring-3 {
  inset: 16%;
  animation-duration: 10s;
  opacity: 0.4;
}

.pedestal-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ped-particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.25rem;
  height: 0.25rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.9), rgba(147, 51, 234, 0.5));
  box-shadow: 0 0 8px rgba(236, 72, 153, 0.8);
  transform-origin: center;
  transform: rotate(var(--ped-angle, 0deg)) translateY(-2.5rem) scale(0.8);
  animation: ped-particle-float 4s ease-in-out infinite;
  animation-delay: calc(var(--ped-angle) * 0.01s);
}

.portal-sphere {
  position: relative;
  width: var(--sphere-size, 5.5rem);
  height: var(--sphere-size, 5.5rem);
  border-radius: 50%;
  display: grid;
  place-items: center;
  overflow: visible;
  transform-style: preserve-3d;
  animation: sphere-float 6s ease-in-out infinite;
  filter: drop-shadow(0 0 45px rgba(147, 51, 234, 0.6)) drop-shadow(0 0 80px rgba(59, 130, 246, 0.4));
  will-change: transform, filter;
  z-index: 2;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.6s ease;
}

.portal-sphere:hover {
  transform: scale(1.08) translateY(-4px);
  filter: drop-shadow(0 0 65px rgba(147, 51, 234, 0.85)) drop-shadow(0 0 120px rgba(59, 130, 246, 0.65));
}

.sphere-shields {
  position: absolute;
  inset: -32%;
  pointer-events: none;
  transform-style: preserve-3d;
}

.energy-shield {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.2), rgba(236, 72, 153, 0.25), rgba(147, 51, 234, 0.3));
  background-clip: padding-box;
  opacity: 0.6;
  animation: shield-rotate 12s linear infinite;
  filter: drop-shadow(0 0 15px rgba(147, 51, 234, 0.4));
}

.energy-shield.shield-1 {
  transform: rotateX(60deg) rotateZ(0deg);
}

.energy-shield.shield-2 {
  transform: rotateX(60deg) rotateZ(60deg);
  animation-delay: -4s;
}

.energy-shield.shield-3 {
  transform: rotateX(60deg) rotateZ(120deg);
  animation-delay: -8s;
}

.sphere-aurora {
  position: absolute;
  inset: -25%;
  border-radius: 50%;
  background: conic-gradient(from 0deg, rgba(147, 51, 234, 0.4), rgba(59, 130, 246, 0.35), rgba(236, 72, 153, 0.4), rgba(168, 85, 247, 0.35), rgba(147, 51, 234, 0.4));
  filter: blur(20px);
  opacity: calc(0.5 + (var(--magic-progress, 0) * 0.4));
  animation: aurora-rotate 18s linear infinite;
  mix-blend-mode: screen;
}

.sphere-wireframe {
  position: absolute;
  inset: 0;
  pointer-events: none;
  animation: wireframe-pulse 8s ease-in-out infinite;
}

.wireframe-svg {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: wireframe-spin 20s linear infinite;
}

.wire-circle {
  fill: none;
  stroke: rgba(147, 51, 234, 0.5);
  stroke-width: 0.5;
  filter: drop-shadow(0 0 8px rgba(147, 51, 234, 0.6));
  animation: wire-pulse 3s ease-in-out infinite;
}

.wire-circle.c2 {
  animation-delay: 0.5s;
}

.wire-circle.c3 {
  animation-delay: 1s;
}

.wire-line {
  stroke: rgba(59, 130, 246, 0.4);
  stroke-width: 0.5;
  stroke-dasharray: 4 2;
  filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.5));
  animation: wire-dash 4s linear infinite;
}

.wire-line.l2 { animation-delay: 0.5s; }
.wire-line.l3 { animation-delay: 1s; }
.wire-line.l4 { animation-delay: 1.5s; }

.sphere-body {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  overflow: hidden;
  background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.15), rgba(147, 51, 234, 0.3) 40%, rgba(59, 130, 246, 0.4) 70%, rgba(15, 23, 42, 0.8));
  box-shadow: inset 0 0 35px rgba(147, 51, 234, 0.5), inset 0 0 65px rgba(59, 130, 246, 0.3);
}

.sphere-gradient {
  position: absolute;
  inset: -30%;
  background: conic-gradient(from 0deg, rgba(147, 51, 234, 0.6), rgba(236, 72, 153, 0.4), rgba(59, 130, 246, 0.5), rgba(168, 85, 247, 0.4), rgba(147, 51, 234, 0.6));
  filter: blur(12px);
  mix-blend-mode: screen;
  animation: gradient-flow 16s linear infinite;
  opacity: 0.7;
}

.sphere-gradient.layer-2 {
  animation-duration: 22s;
  animation-direction: reverse;
  opacity: 0.5;
  filter: blur(18px);
}

.sphere-gradient.layer-3 {
  animation-duration: 30s;
  opacity: 0.35;
  filter: blur(25px);
}

.sphere-runes {
  position: absolute;
  inset: 12%;
  border-radius: 50%;
  pointer-events: none;
}

.rune {
  position: absolute;
  font-size: 1.2rem;
  color: rgba(236, 72, 153, 0.85);
  text-shadow: 0 0 15px rgba(147, 51, 234, 0.9), 0 0 30px rgba(59, 130, 246, 0.6);
  animation: rune-orbit 10s ease-in-out infinite;
  font-weight: 700;
}

.rune-1 { top: 0; left: 50%; transform: translate(-50%, -50%); animation-delay: 0s; }
.rune-2 { top: 25%; right: 6%; animation-delay: 0.8s; }
.rune-3 { top: 75%; right: 6%; animation-delay: 1.6s; }
.rune-4 { bottom: 0; left: 50%; transform: translate(-50%, 50%); animation-delay: 2.4s; }
.rune-5 { top: 75%; left: 6%; animation-delay: 3.2s; }
.rune-6 { top: 25%; left: 6%; animation-delay: 4s; }

.sphere-core {
  position: absolute;
  inset: 30%;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.95), rgba(236, 72, 153, 0.7) 45%, rgba(147, 51, 234, 0.5));
  box-shadow: 0 0 40px rgba(236, 72, 153, 0.9), 0 0 70px rgba(147, 51, 234, 0.6);
  animation: core-breathe 4s ease-in-out infinite;
  overflow: hidden;
}

.core-helix {
  position: absolute;
  width: 140%;
  height: 15%;
  border-radius: 9999px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.7), transparent);
  filter: blur(1px);
  animation: helix-rotate 3s linear infinite;
}

.core-helix.helix-1 {
  transform: rotate(45deg);
}

.core-helix.helix-2 {
  transform: rotate(-45deg);
  animation-delay: -1.5s;
}

.core-center {
  width: 35%;
  height: 35%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 1), rgba(236, 72, 153, 0.8));
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.9);
  animation: center-pulse 2s ease-in-out infinite;
}

.sphere-waves {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
}

.energy-wave {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.6);
  opacity: 0;
  animation: wave-expand 4s ease-out infinite;
}

.energy-wave.wave-2 {
  animation-delay: 1.33s;
}

.energy-wave.wave-3 {
  animation-delay: 2.66s;
}

.sphere-particles {
  position: absolute;
  inset: -15%;
  pointer-events: none;
}

.burst-particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.9), rgba(147, 51, 234, 0.6));
  transform-origin: center;
  transform: rotate(var(--burst-angle, 0deg)) translateY(0);
  animation: particle-burst 3s ease-in-out infinite;
  animation-delay: calc(var(--burst-angle) * 0.01s);
  box-shadow: 0 0 8px rgba(236, 72, 153, 0.8);
}

.sphere-orbs {
  position: absolute;
  inset: -8%;
  pointer-events: none;
}

.energy-orb {
  position: absolute;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9), rgba(59, 130, 246, 0.7));
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.9);
  animation: orb-float 8s ease-in-out infinite;
}

.energy-orb.orb-1 {
  top: 10%;
  left: 15%;
}

.energy-orb.orb-2 {
  top: 60%;
  right: 10%;
  animation-delay: 2.6s;
}

.energy-orb.orb-3 {
  bottom: 15%;
  left: 20%;
  animation-delay: 5.2s;
}

.portal-sparkles {
  position: absolute;
  inset: -12%;
  pointer-events: none;
}

.sparkle-node {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  transform-origin: center;
  transform: rotate(var(--sparkle-angle, 0deg)) translateY(-5rem) rotate(calc(-1 * var(--sparkle-angle, 0deg)));
  animation: sparkle-float 4.5s ease-in-out infinite;
  animation-delay: var(--sparkle-delay, 0s);
  pointer-events: auto;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 18px rgba(147, 51, 234, 0.85);
  transition: transform 0.3s ease, filter 0.3s ease;
  will-change: transform;
}

.sparkle-node:hover {
  transform: rotate(var(--sparkle-angle, 0deg)) translateY(-5rem) rotate(calc(-1 * var(--sparkle-angle, 0deg))) scale(1.2);
  filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.9));
}

.sparkle-glyph {
  font-size: 1.1rem;
}

.portal-ambient {
  position: absolute;
  inset: -18%;
  pointer-events: none;
}

.portal-ambient .ambient-particle {
  position: absolute;
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.85), rgba(168, 85, 247, 0.3));
  filter: blur(0.4px);
  opacity: 0.75;
  animation: ambient-drift 9s ease-in-out infinite;
  will-change: transform, opacity;
}

.portal-ambient .ambient-particle:nth-child(1) {
  top: 8%;
  left: 42%;
}

.portal-ambient .ambient-particle:nth-child(2) {
  top: 22%;
  right: 18%;
  animation-delay: 1s;
}

.portal-ambient .ambient-particle:nth-child(3) {
  top: 48%;
  left: 12%;
  animation-delay: 2s;
}

.portal-ambient .ambient-particle:nth-child(4) {
  bottom: 20%;
  right: 10%;
  animation-delay: 3s;
}

.portal-ambient .ambient-particle:nth-child(5) {
  bottom: 8%;
  left: 30%;
  animation-delay: 4s;
}

.portal-ambient .ambient-particle:nth-child(6) {
  top: 32%;
  left: 70%;
  animation-delay: 5s;
}

@keyframes portal-backdrop-pulse {
  0%,
  100% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

@keyframes portal-halo-drift {
  0% {
    transform: rotate(0deg) scale(0.98);
    opacity: 0.85;
  }
  50% {
    transform: rotate(180deg) scale(1.02);
    opacity: 1;
  }
  100% {
    transform: rotate(360deg) scale(0.98);
    opacity: 0.85;
  }
}

@keyframes portal-ribbon-pulse {
  0%,
  100% {
    opacity: 0.3;
    filter: blur(0.6px);
  }
  50% {
    opacity: 0.65;
    filter: blur(1.3px);
  }
}

@keyframes orbit-spin {
  0% {
    transform: rotate(0deg) scale(var(--orbit-scale, 1));
  }
  100% {
    transform: rotate(360deg) scale(var(--orbit-scale, 1));
  }
}

@keyframes glyph-orbit {
  0% {
    transform: rotate(var(--orbit-angle, 0deg)) translateY(-4.4rem) rotate(calc(-1 * var(--orbit-angle, 0deg)));
  }
  100% {
    transform: rotate(calc(var(--orbit-angle, 0deg) + 360deg)) translateY(-4.4rem) rotate(calc(-1 * (var(--orbit-angle, 0deg) + 360deg)));
  }
}

@keyframes sphere-float {
  0%, 100% {
    transform: translateY(0) rotateZ(0deg) scale(1);
  }
  33% {
    transform: translateY(-10px) rotateZ(5deg) scale(1.02);
  }
  66% {
    transform: translateY(-5px) rotateZ(-5deg) scale(0.98);
  }
}

@keyframes shield-rotate {
  0% {
    transform: rotateX(60deg) rotateZ(0deg);
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: rotateX(60deg) rotateZ(360deg);
    opacity: 0.4;
  }
}

@keyframes aurora-rotate {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.08);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

@keyframes wireframe-pulse {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.03);
  }
}

@keyframes wireframe-spin {
  0% {
    transform: rotateY(0deg) rotateX(15deg);
  }
  100% {
    transform: rotateY(360deg) rotateX(15deg);
  }
}

@keyframes wire-pulse {
  0%, 100% {
    stroke-opacity: 0.4;
  }
  50% {
    stroke-opacity: 1;
  }
}

@keyframes wire-dash {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 12;
  }
}

@keyframes gradient-flow {
  0% {
    transform: rotate(0deg) scale(1);
  }
  100% {
    transform: rotate(360deg) scale(1.1);
  }
}

@keyframes rune-orbit {
  0%, 100% {
    transform: scale(0.9) translateZ(0);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2) translateZ(5px);
    opacity: 1;
  }
}

@keyframes core-breathe {
  0%, 100% {
    transform: scale(0.94);
    box-shadow: 0 0 35px rgba(236, 72, 153, 0.8), 0 0 60px rgba(147, 51, 234, 0.5);
  }
  50% {
    transform: scale(1.06);
    box-shadow: 0 0 50px rgba(236, 72, 153, 1), 0 0 90px rgba(147, 51, 234, 0.8);
  }
}

@keyframes helix-rotate {
  0% {
    transform: rotate(45deg) translateX(-50%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: rotate(405deg) translateX(50%);
    opacity: 0;
  }
}

@keyframes center-pulse {
  0%, 100% {
    transform: scale(0.9);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes wave-expand {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  25% {
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes particle-burst {
  0%, 100% {
    transform: rotate(var(--burst-angle, 0deg)) translateY(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: rotate(var(--burst-angle, 0deg)) translateY(-2.8rem) scale(0.6);
    opacity: 0.8;
  }
  90% {
    opacity: 0;
  }
}

@keyframes orb-float {
  0%, 100% {
    transform: translate(0, 0) scale(0.9);
    opacity: 0.7;
  }
  33% {
    transform: translate(8px, -12px) scale(1.2);
    opacity: 1;
  }
  66% {
    transform: translate(-6px, 10px) scale(1.1);
    opacity: 0.9;
  }
}

@keyframes pedestal-glow-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
}

@keyframes pedestal-layer-pulse {
  0%, 100% {
    box-shadow: 0 0 15px rgba(147, 51, 234, 0.5), inset 0 0 10px rgba(236, 72, 153, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(147, 51, 234, 0.9), inset 0 0 20px rgba(236, 72, 153, 0.6);
  }
}

@keyframes pedestal-ring-rotate {
  0% {
    transform: rotateZ(0deg);
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    transform: rotateZ(360deg);
    opacity: 0.4;
  }
}

@keyframes ped-particle-float {
  0%, 100% {
    transform: rotate(var(--ped-angle, 0deg)) translateY(-2.5rem) scale(0.8);
    opacity: 0.6;
  }
  50% {
    transform: rotate(var(--ped-angle, 0deg)) translateY(-3rem) scale(1.1);
    opacity: 1;
  }
}

@keyframes sparkle-float {
  0%,
  100% {
    transform: rotate(var(--sparkle-angle, 0deg)) translateY(-5rem) rotate(calc(-1 * var(--sparkle-angle, 0deg)));
    opacity: 0.6;
  }
  50% {
    transform: rotate(calc(var(--sparkle-angle, 0deg) + 8deg)) translateY(-5.2rem) rotate(calc(-1 * (var(--sparkle-angle, 0deg) + 8deg)));
    opacity: 1;
  }
}

@keyframes ambient-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate3d(6px, -10px, 0) scale(1.3);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .magical-portal {
    width: 8.5rem;
    height: 8.5rem;
  }

  .portal-pedestal {
    bottom: 2%;
    width: 5.5rem;
    height: 2.5rem;
  }

  .portal-sphere {
    --sphere-size: 4.5rem;
  }

  .symbol-glyph {
    font-size: 0.85rem;
  }

  .sparkle-glyph {
    font-size: 0.9rem;
  }
  
  .rune {
    font-size: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .magical-portal,
  .portal-backdrop,
  .portal-progress-halo,
  .portal-ribbons,
  .orbit-ring,
  .orbiting-symbol,
  .portal-sphere,
  .pedestal-ring,
  .ped-particle,
  .energy-shield,
  .sphere-aurora,
  .wireframe-svg,
  .wire-circle,
  .wire-line,
  .sphere-gradient,
  .rune,
  .sphere-core,
  .core-helix,
  .core-center,
  .energy-wave,
  .burst-particle,
  .energy-orb,
  .sparkle-node,
  .portal-ambient .ambient-particle {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
