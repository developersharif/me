<template>
  <div class="calm-background hidden md:block">
    <!-- Animated gradient orbs -->
    <div class="gradient-orb orb-1"></div>
    <div class="gradient-orb orb-2"></div>
    <div class="gradient-orb orb-3"></div>
    <div class="gradient-orb orb-4"></div>
    
    <!-- Floating particles -->
    <div class="particles-container">
      <div v-for="n in 12" :key="n" class="particle" :style="getParticleStyle(n)"></div>
    </div>
    
    <!-- Subtle geometric patterns -->
    <div class="geometric-pattern">
      <svg viewBox="0 0 200 200" class="pattern-svg">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
    
    <!-- Ambient light effects -->
    <div class="ambient-light light-1"></div>
    <div class="ambient-light light-2"></div>
    <div class="ambient-light light-3"></div>
  </div>
</template>

<script setup lang="ts">
// Generate random styles for particles
const getParticleStyle = (index: number) => {
  const size = Math.random() * 4 + 2 // Larger particles: 2-6px
  const left = Math.random() * 100
  const animationDelay = Math.random() * 5 // Shorter delay spread
  const animationDuration = Math.random() * 10 + 8 // Faster: 8-18s
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${animationDelay}s`,
    animationDuration: `${animationDuration}s`
  }
}
</script>

<style scoped>
.calm-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -10;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #0f0f23 0%,
    #1a1a3a 25%,
    #2d1b69 50%,
    #1a1a3a 75%,
    #0f0f23 100%
  );
  animation: breathe 15s ease-in-out infinite;
  pointer-events: none;
}

/* Animated gradient orbs */
.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  animation: gentleFloat 8s ease-in-out infinite;
  transition: all 0.8s ease;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%);
  top: 10%;
  left: 20%;
  animation-delay: 0s;
  animation-duration: 12s;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  top: 60%;
  right: 15%;
  animation-delay: -3s;
  animation-duration: 15s;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%);
  bottom: 20%;
  left: 10%;
  animation-delay: -6s;
  animation-duration: 14s;
}

.orb-4 {
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%);
  top: 30%;
  right: 40%;
  animation-delay: -9s;
  animation-duration: 11s;
}

/* Floating particles */
.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: gentleParticleFloat linear infinite;
}

/* Geometric pattern overlay */
.geometric-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
}

.pattern-svg {
  width: 100%;
  height: 100%;
}

/* Ambient light effects */
.ambient-light {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.08;
  animation: gentlePulse 12s ease-in-out infinite;
}

.light-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
  top: -10%;
  left: -10%;
  animation-delay: 0s;
  animation-duration: 15s;
}

.light-2 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(139, 69, 19, 0.25) 0%, transparent 70%);
  bottom: -10%;
  right: -10%;
  animation-delay: -5s;
  animation-duration: 18s;
}

.light-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(75, 85, 99, 0.2) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -8s;
  animation-duration: 20s;
}

/* Animations */
@keyframes gentleFloat {
  0%, 100% {
    transform: translateY(0px) translateX(0px) scale(1);
  }
  25% {
    transform: translateY(-15px) translateX(10px) scale(1.03);
  }
  50% {
    transform: translateY(-8px) translateX(-12px) scale(0.97);
  }
  75% {
    transform: translateY(-18px) translateX(6px) scale(1.01);
  }
}

@keyframes gentleParticleFloat {
  0% {
    transform: translateY(100vh) translateX(0px) rotate(0deg);
    opacity: 0;
  }
  5% {
    opacity: 0.6;
  }
  95% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100px) translateX(20px) rotate(180deg);
    opacity: 0;
  }
}

@keyframes gentlePulse {
  0%, 100% {
    opacity: 0.08;
    transform: scale(1);
  }
  33% {
    opacity: 0.12;
    transform: scale(1.03);
  }
  66% {
    opacity: 0.06;
    transform: scale(0.97);
  }
}

@keyframes breathe {
  0%, 100% {
    background: linear-gradient(
      135deg,
      #0f0f23 0%,
      #1a1a3a 25%,
      #2d1b69 50%,
      #1a1a3a 75%,
      #0f0f23 100%
    );
  }
  50% {
    background: linear-gradient(
      135deg,
      #0f0f23 0%,
      #1e1e42 25%,
      #341d75 50%,
      #1e1e42 75%,
      #0f0f23 100%
    );
  }
}

/* Tablet and smaller desktop adjustments */
@media (min-width: 768px) and (max-width: 1024px) {
  .gradient-orb {
    filter: blur(40px);
    opacity: 0.3;
  }
  
  .orb-1, .orb-2 {
    width: 200px;
    height: 200px;
  }
  
  .orb-3, .orb-4 {
    width: 150px;
    height: 150px;
  }
  
  .ambient-light {
    filter: blur(60px);
  }
}

/* Performance optimizations for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .gradient-orb,
  .particle,
  .ambient-light {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
