<template>
  <Teleport to="body">
    <div class="magical-cursor-system pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <!-- Main Glow / Light Source (DOM for crispness) -->
      <div 
        ref="cursorGlow"
        class="cursor-glow absolute top-0 left-0 w-64 h-64 rounded-full opacity-60 mix-blend-screen"
        :style="glowStyle"
      ></div>

      <!-- Core Cursor (Sharp point) -->
      <div 
        ref="cursorCore"
        class="cursor-core-wrapper absolute top-0 left-0 w-4 h-4 flex items-center justify-center pointer-events-none"
        :style="coreStyle"
      >
        <div class="cursor-visual w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
      </div>

      <!-- Particle Trails (Canvas for performance) -->
      <canvas ref="canvas" class="block w-full h-full opacity-90"></canvas>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const cursorGlow = ref<HTMLElement | null>(null);
const cursorCore = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

// State
const mouse = { x: -100, y: -100 };
const lastMouse = { x: -100, y: -100 };
const velocity = { x: 0, y: 0 };
let isActive = false;
let animationFrame: number;

// Config
const colors = [
  'hsla(270, 80%, 60%, 1)', // Purple
  'hsla(290, 80%, 60%, 1)', // Magenta
  'hsla(250, 80%, 70%, 1)', // Indigo
  'hsla(45, 100%, 70%, 1)'  // Gold highlight
];

// Particle System
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;

  constructor(x: number, y: number, vx: number, vy: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.maxLife = Math.random() * 30 + 20;
    this.life = this.maxLife;
    this.size = Math.random() * 3 + 1;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.95; // Friction
    this.vy *= 0.95;
    this.life--;
    this.size *= 0.96; // Shrink
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = this.life / this.maxLife;
    ctx.fillStyle = this.color.replace(', 1)', `, ${alpha})`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particles: Particle[] = [];

// Computed Styles
const glowStyle = ref({ transform: 'translate(-50%, -50%) translate3d(-100px, -100px, 0)' });
const coreStyle = ref({ transform: 'translate(-50%, -50%) translate3d(-100px, -100px, 0)' });

const updateDOM = () => {
  // Direct DOM manipulation for performance (skipping Vue reactivity for 60fps transform)
  if (cursorGlow.value) {
    cursorGlow.value.style.transform = `translate(-50%, -50%) translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
  }
  if (cursorCore.value) {
    cursorCore.value.style.transform = `translate(-50%, -50%) translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
  }
};

const loop = () => {
  if (!canvas.value) return;
  const ctx = canvas.value.getContext('2d');
  if (!ctx) return;

  // Clear
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  // Calculate velocity for "stretching" effect or particle direction
  velocity.x = mouse.x - lastMouse.x;
  velocity.y = mouse.y - lastMouse.y;
  
  // Spawn particles if moving
  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  if (speed > 0.5) {
    // Interpolate positions for smooth trails even at high speed
    const steps = Math.min(speed, 5); // Don't spawn too many
    for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const px = lastMouse.x + (mouse.x - lastMouse.x) * t;
        const py = lastMouse.y + (mouse.y - lastMouse.y) * t;
        
        // Add randomness/spread
        const spread = 2;
        const vx = (Math.random() - 0.5) * spread;
        const vy = (Math.random() - 0.5) * spread;
        
        particles.push(new Particle(px, py, vx, vy));
    }
  }

  // Update & Draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw(ctx);
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }

  // Draw Magic Connecting Lines (Constellation effect) near cursor
  // Only connect recent particles to cursor for a "web" effect
  ctx.strokeStyle = 'rgba(147, 51, 234, 0.15)';
  ctx.beginPath();
  let connected = 0;
  for (let i = particles.length - 1; i >= 0; i--) {
      // optimization: only check last 20 particles
      if (connected > 15) break; 
      const p = particles[i];
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = dx*dx + dy*dy;
      if (dist < 2500) { // 50px radius
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          connected++;
      }
  }
  ctx.stroke();

  lastMouse.x = mouse.x;
  lastMouse.y = mouse.y;

  updateDOM();
  animationFrame = requestAnimationFrame(loop);
};

const onMouseMove = (e: MouseEvent) => {
  // First activation
  if (!isActive) {
    isActive = true;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    lastMouse.x = e.clientX;
    lastMouse.y = e.clientY;
  }
  
  // Smooth lerp could be done here, but let's stick to 1:1 for crisp response
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

const handleResize = () => {
    if (canvas.value) {
        canvas.value.width = window.innerWidth;
        canvas.value.height = window.innerHeight;
    }
};

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('resize', handleResize);
  handleResize();
  loop();
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('resize', handleResize);
  cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
.cursor-glow {
  background: radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(79, 70, 229, 0.1) 40%, transparent 70%);
  filter: blur(20px);
  will-change: transform;
}
.cursor-core-wrapper {
  will-change: transform;
}

.cursor-visual {
  animation: cursor-pulse 2s infinite ease-in-out;
}

@keyframes cursor-pulse {
  0% { transform: scale(1); box-shadow: 0 0 10px rgba(255,255,255,0.8); }
  50% { transform: scale(1.3); box-shadow: 0 0 25px rgba(255,255,255,0.9), 0 0 15px rgba(147, 51, 234, 0.6); }
  100% { transform: scale(1); box-shadow: 0 0 10px rgba(255,255,255,0.8); }
}
</style>
