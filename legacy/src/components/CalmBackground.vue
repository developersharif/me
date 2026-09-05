<template>
  <div class="calm-background hidden md:block" aria-hidden="true">
    <!-- Image Container with Parallax-like breathing -->
    <div class="image-container">
      <img 
        src="/assets/images/my-workspace.jpeg" 
        alt="Creative Workspace" 
        class="workspace-image"
      />
      <!-- Cinematic Overlay -->
      <div class="overlay gradient-overlay"></div>
      <div class="overlay noise-overlay"></div>
      <div class="overlay vignette-overlay"></div>
    </div>
    
    <!-- Ambient particles for depth -->
    <div class="particles-container">
      <div v-for="n in 8" :key="n" class="particle" :style="getParticleStyle(n)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Minimal particle logic for subtle ambience
const getParticleStyle = (index: number) => {
  const size = Math.random() * 3 + 1
  const left = Math.random() * 100
  const top = Math.random() * 100
  const delay = Math.random() * -20
  const duration = Math.random() * 20 + 20
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: Math.random() * 0.3 + 0.1
  }
}
</script>

<style scoped>
.calm-background {
  position: fixed;
  inset: 0;
  z-index: -10;
  overflow: hidden;
  background-color: #050505;
}

.image-container {
  position: absolute;
  inset: -5%; /* Slightly larger to allow movement */
  width: 110%;
  height: 110%;
  animation: slow-breathe 60s ease-in-out infinite alternate;
}

.workspace-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.8) contrast(1.1);
  opacity: 0.4; /* dim it down significantly */
}

/* Overlays for readability and polish */
.overlay {
  position: absolute;
  inset: 0;
}

.gradient-overlay {
  background: linear-gradient(
    135deg,
    rgba(5, 5, 10, 0.9) 0%,
    rgba(10, 10, 20, 0.7) 40%,
    rgba(10, 10, 20, 0.7) 60%,
    rgba(5, 5, 10, 0.9) 100%
  );
  mix-blend-mode: multiply;
}

.noise-overlay {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  opacity: 0.4;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.vignette-overlay {
  background: radial-gradient(
    circle at center,
    transparent 20%,
    rgba(0, 0, 0, 0.6) 80%,
    rgba(0, 0, 0, 0.9) 100%
  );
}

.particles-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: white;
  border-radius: 50%;
  filter: blur(1px);
  animation: float linear infinite;
}

@keyframes slow-breathe {
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.05) translate(-1%, -1%); }
}

@keyframes float {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  20% { opacity: var(--opacity, 0.3); }
  80% { opacity: var(--opacity, 0.3); }
  100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
}
</style>
