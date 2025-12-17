<template>
  <div
    ref="portalContainer"
    class="relative magical-portal cursor-pointer group"
    :style="{ 
      '--sparkle-intensity': sparkleIntensity, 
      '--magic-progress': magicLevel / 10,
      '--tilt-x': tilt.x + 'deg',
      '--tilt-y': tilt.y + 'deg'
    }"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @click="$emit('click')"
  >
    <!-- Deep Space Ambience -->
    <div class="portal-ambience"></div>

    <!-- The 3D Rotatable Core System -->
    <div class="portal-system-3d">
      
      <!-- Back Halo -->
      <div class="void-halo"></div>

      <!-- Outer Data Rings (Runic Arrays) -->
      <div class="data-ring ring-outer"></div>
      <div class="data-ring ring-mid"></div>
      <div class="data-ring ring-inner">
        <svg viewBox="0 0 100 100" class="runic-svg">
          <path id="runePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="transparent" />
          <text fill="rgba(147, 51, 234, 0.8)" font-size="6" letter-spacing="4">
            <textPath href="#runePath" startOffset="0%">
              {{ symbols.join(' • ') }} • {{ symbols.join(' • ') }}
            </textPath>
          </text>
        </svg>
      </div>

      <!-- Accretion Disk (Energy Swirl) -->
      <div class="accretion-disk">
        <div class="disk-plasma"></div>
        <div class="disk-particles"></div>
      </div>

      <!-- Event Horizon (The Void border) -->
      <div class="event-horizon"></div>

      <!-- The Void (Singularity Center) -->
      <div class="singularity-void">
        <div class="void-depth"></div>
        <div class="void-core"></div>
      </div>

      <!-- Holographic Projection Beam -->
      <div class="holo-beam"></div>

      <!-- Orbiting "Moons" (Symbols) -->
      <div class="orbit-system">
        <div 
          v-for="(sym, i) in sparkleSymbols.slice(0, 4)" 
          :key="`moon-${i}`"
          class="portal-moon"
          :style="{ '--orbit-index': i, '--total': 4 }"
          @mouseenter="$emit('sparkle-hover', i)"
        >
          <span class="moon-glyph">{{ sym }}</span>
          <div class="moon-trail"></div>
        </div>
      </div>

    </div>
  
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{ 
  symbols: string[]; 
  sparkleSymbols: string[]; 
  sparkleIntensity: number | string; 
  magicLevel: number 
}>();

defineEmits<{ 
  (e: 'enter'): void; 
  (e: 'leave'): void; 
  (e: 'click'): void; 
  (e: 'symbol-hover', i: number): void; 
  (e: 'sparkle-hover', i: number): void 
}>();

const portalContainer = ref<HTMLElement | null>(null);
const tilt = ref({ x: 0, y: 0 });

const handleMouseMove = (e: MouseEvent) => {
  if (!portalContainer.value) return;
  
  const rect = portalContainer.value.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  
  // Max tilt angle
  const maxTilt = 15;
  
  // Calculate tilt (Y axis rotation depends on X position, X axis rotation depends on Y position)
  tilt.value = {
    x: -(y / (rect.height / 2)) * maxTilt,
    y: (x / (rect.width / 2)) * maxTilt
  };
};

const handleMouseLeave = () => {
  tilt.value = { x: 0, y: 0 };
};
</script>

<style scoped>
.magical-portal {
  position: relative;
  width: 14rem;
  height: 14rem;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
  transform-style: preserve-3d;
  user-select: none;
}

/* 3D Container */
.portal-system-3d {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
  transition: transform 0.2s cubic-bezier(0.1, 0.5, 0.3, 1); /* Smooth but responsive */
}

/* Ambience */
.portal-ambience {
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.15), transparent 60%);
  filter: blur(40px);
  pointer-events: none;
  animation: ambience-pulse 4s ease-in-out infinite;
}

/* Void Halo */
.void-halo {
  position: absolute;
  inset: -10%;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent, rgba(79, 70, 229, 0.3), transparent, rgba(236, 72, 153, 0.3), transparent);
  mix-blend-mode: screen;
  filter: blur(10px);
  animation: halo-spin 10s linear infinite;
  transform: translateZ(-50px);
}

/* Data Rings */
.data-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed rgba(147, 51, 234, 0.3);
  transform-style: preserve-3d;
}

.ring-outer {
  inset: 0%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left-color: rgba(147, 51, 234, 0.6);
  border-right-color: rgba(59, 130, 246, 0.6);
  transform: translateZ(10px) rotate(45deg);
  animation: ring-spin-slow 20s linear infinite;
}

.ring-mid {
  inset: 15%;
  border: 2px dashed rgba(236, 72, 153, 0.4);
  transform: translateZ(20px) rotate(-15deg);
  animation: ring-spin 12s linear infinite reverse;
}

.ring-inner {
  inset: 25%;
  border: none;
  transform: translateZ(30px);
  animation: ring-spin 25s linear infinite;
}

.runic-svg {
  width: 100%;
  height: 100%;
  animation: svg-spin 30s linear infinite;
}

/* Accretion Disk */
.accretion-disk {
  position: absolute;
  inset: 28%;
  border-radius: 50%;
  transform: translateZ(40px);
  transform-style: preserve-3d;
}

.disk-plasma {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 180deg, 
    transparent 0%, 
    rgba(147, 51, 234, 0.8) 20%, 
    rgba(255, 255, 255, 0.9) 25%, 
    rgba(79, 70, 229, 0.8) 30%, 
    transparent 60%
  );
  filter: blur(8px);
  mix-blend-mode: screen;
  animation: plasma-spin 2s linear infinite;
}

/* Event Horizon */
.event-horizon {
  position: absolute;
  inset: 32%;
  border-radius: 50%;
  background: transparent;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.6), inset 0 0 20px rgba(147, 51, 234, 0.8);
  transform: translateZ(45px);
  z-index: 10;
}

/* Singularity */
.singularity-void {
  position: absolute;
  inset: 34%;
  border-radius: 50%;
  background: #000;
  transform: translateZ(44px); /* Just behind horizon */
  overflow: hidden;
  box-shadow: inset 0 0 30px #000;
}

.void-depth {
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle, rgba(20, 0, 40, 1), #000 70%);
  animation: void-breathe 4s ease-in-out infinite;
}

.void-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px white, 0 0 30px rgba(147, 51, 234, 1);
  animation: core-flicker 0.1s infinite alternate;
}

/* Holo Beam */
.holo-beam {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 200%;
  background: linear-gradient(to bottom, rgba(147, 51, 234, 0.1), transparent);
  transform-origin: top center;
  transform: translate(-50%, 0) rotateX(70deg) translateZ(50px);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.group:hover .holo-beam {
  opacity: 1;
}

/* Orbit System */
.orbit-system {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform: translateZ(20px);
}

.portal-moon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: 0 0; /* Center of portal */
  animation: moon-orbit 8s linear infinite;
  animation-delay: calc(var(--orbit-index) * -2s);
  pointer-events: auto; /* Interactive moons */
}

/* Calculate orbit position dynamically in keyframes or via simplified rotation wrapper */
/* Actually, better to rotate the wrapper. */
.portal-moon {
  /* Reset position to center, then rotate container? No, let's use the transform trick */
  /* Using a wrapper div would be cleaner but let's do the transform math here */
  transform: rotate(calc(var(--orbit-index) * 90deg)) translateX(6rem) rotate(calc(var(--orbit-index) * -90deg)); 
  animation: moon-orbit-complex 10s linear infinite;
  animation-delay: calc(var(--orbit-index) * -2.5s);
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.portal-moon:hover {
  background: rgba(147, 51, 234, 0.6);
  border-color: #fff;
  box-shadow: 0 0 15px rgba(236, 72, 153, 0.8);
  transform: rotate(calc(var(--orbit-index) * 90deg)) translateX(7rem) scale(1.2) rotate(calc(var(--orbit-index) * -90deg)) !important; /* Pause/Expand */
  z-index: 50;
}

.moon-glyph {
  font-size: 0.8rem;
  color: white;
}

/* Animations */
@keyframes ring-spin {
  to { transform: translateZ(30px) rotate(360deg); }
}
@keyframes ring-spin-slow {
  to { transform: translateZ(10px) rotate(360deg + 45deg); }
}
@keyframes plasma-spin {
  to { transform: rotate(360deg); }
}
@keyframes halo-spin {
  to { transform: translateZ(-50px) rotate(360deg); }
}
@keyframes moon-orbit-complex {
  from { transform: rotate(0deg) translateX(6rem) rotate(0deg); }
  to { transform: rotate(360deg) translateX(6rem) rotate(-360deg); }
}
@keyframes core-flicker {
  0% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.9); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
}

</style>
