<template>
  <section class="cover-responsive h-full flex flex-col items-center justify-center text-center gap-6 md:gap-5 relative overflow-hidden py-6 md:py-8">
    <!-- Professional background photo with overlays -->
    <div class="absolute inset-0 -z-10">
      <img 
        v-if="data.background"
        :src="resolveAsset(data.background)"
        alt="Workstation background"
        class="w-full h-full object-cover opacity-30 md:opacity-40 scale-105"
        loading="eager"
        decoding="async"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-indigo-950/50 to-purple-950/50"></div>
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,.15),transparent_60%)]"></div>
  <div class="absolute inset-0 pointer-events-none cover-noise"></div>
    </div>
    
    <!-- Optimized floating particles using CSS-only approach -->
    <div class="absolute inset-0 floating-particles-container">
      <!-- Use CSS pseudo-elements and keyframes instead of v-for with random calculations -->
    </div>
    
    <!-- Main content -->
  <div class="relative z-10 w-full max-w-3xl mx-auto px-4 md:px-6 cover-fit">
      <CoverHeader
        :symbol="data.symbol"
        :titlePrefix="data.titlePrefix"
        :name="data.name"
        :tagline="data.tagline"
        :subtitle="data.subtitle"
      />
      
      <!-- Enhanced Magical Call to action -->
      <div 
        class="flex flex-col items-center gap-6 magical-cta"
        :data-magic-level="magicLevel"
        :style="{
          '--particle-intensity': particleIntensity,
          '--magic-glow': magicLevel * 10 + '%'
        }"
      >
        <!-- Sound Toggle Button -->
        <div class="absolute top-4 right-4 z-20">
          <SoundToggle :enabled="soundEnabled" @toggle="toggleSound" />
        </div>

        <!-- Magical Cursor Effect (Desktop Only) -->
        <div 
          v-if="!isMobile"
          ref="cursorEffect" 
          class="magical-cursor-trail pointer-events-none fixed z-50"
          :style="cursorStyle"
        >
          <div class="cursor-particle">✨</div>
        </div>
        
        <!-- Advanced Mystical Energy Portal -->
        <CoverPortal
          :symbols="magicalSymbols"
          :sparkleSymbols="sparkleSymbols"
          :sparkleIntensity="particleIntensity"
          :magicLevel="magicLevel"
          @enter="activateMagic"
          @leave="deactivateMagic"
          @click="triggerMagicalEffect"
          @symbol-hover="playSymbolHover"
          @sparkle-hover="playSparkleHover"
        />
        
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
import CoverHeader from '../components/cover/CoverHeader.vue';
// Lazy load heavy components for better initial performance
const CoverPortal = defineAsyncComponent(() => import('../components/cover/CoverPortal.vue'));
const SoundToggle = defineAsyncComponent(() => import('../components/cover/SoundToggle.vue'));
import { useMagicSound } from '../composables/useMagicSound';
import themeConfig from '../data/theme.json';

interface CoverData {
  symbol: string;
  titlePrefix: string;
  name: string;
  tagline: string;
  subtitle: string;
}

const props = defineProps<{ data?: CoverData }>();
const fallback: CoverData = {
  symbol: '⚡',
  titlePrefix: 'The Codex of',
  name: '[Your Name]',
  tagline: 'Fullstack Alchemist',
  subtitle: 'A chronicle of digital craftsmanship, where code becomes art and innovation meets imagination.',
};
const data = props.data ?? fallback;
if (!props.data) {
  // eslint-disable-next-line no-console
  console.warn('CoverPage: data prop missing, using fallback.');
}

// Resolve assets from public/ with correct base in dev and on GitHub Pages
const resolveAsset = (p: string) => {
  if (!p) return '';
  // Leave full URLs and data URIs unchanged
  if (/^(https?:)?\/\//.test(p) || p.startsWith('data:')) return p;
  const base = (import.meta as any).env?.BASE_URL || '/';
  const normalized = p.replace(/^\//, '');
  return base.replace(/\/$/, '') + '/' + normalized;
};

// Enhanced magical effects state (optimized)
const isMagicActive = ref(false);
const magicalSymbols = ref(['✦', '⟐', '⬟', '◊']); // Reduced from 8 to 4 symbols
const sparkleSymbols = ref(['✨', '⭐', '💫', '🌟']); // Reduced from 8 to 4 symbols
const isExploding = ref(false);

// Device detection for proper magic effects (optimized)
const isMobile = ref(false);
// Removed isTouch as it's redundant with isMobile

// Optimized cursor effect state - only track when needed
const cursorPosition = ref({ x: 0, y: 0 });
const cursorTrackingActive = ref(false);

// Simplified cursor tracking
const cursorStyle = ref({
  left: '0px',
  top: '0px',
  opacity: '0'
});

// Enhanced visual effects (optimized)
const particleIntensity = ref(1);
const magicLevel = ref(0);

// Magic configuration from theme (simplified)
const magicConfig = computed(() => themeConfig.magicEffects || {
  desktopEffectEnabled: !isMobile.value, // Dynamic based on device
  particleBurstCount: 8 // Reduced from 12 to 8
});

// Audio via composable (enhanced gamified version)
const { 
  soundEnabled, 
  isAudioInitialized, 
  initSoundPreference, 
  toggleSound, 
  playMagicalChord, 
  playSparkleSound,
  playExplosionSound, 
  playHoverSound,
  playMagicLevelUp,
  playPortalActivate,
  playPortalDeactivate,
  initializeAudioContext 
} = useMagicSound();

// Enhanced gamified hover helpers
const playSymbolHover = (index: number) => { 
  if (!soundEnabled.value) return; 
  playHoverSound(index); // Use specialized hover sound with musical scale
};
const playSparkleHover = (index: number) => { 
  if (!soundEnabled.value) return; 
  playSparkleSound(800 + (index * 100)); // Different pitch per sparkle
};

// Optimized cursor tracking with throttling
let cursorThrottle: number | null = null;
const updateCursorPosition = (event: MouseEvent) => {
  if (cursorThrottle) return; // Throttle to 16ms (~60fps)
  
  cursorThrottle = window.setTimeout(() => {
    cursorPosition.value = { 
      x: event.clientX, 
      y: event.clientY 
    };
    
    cursorStyle.value = {
      left: (event.clientX - 10) + 'px',
      top: (event.clientY - 10) + 'px',
      opacity: isMagicActive.value ? '1' : '0.5'
    };
    cursorThrottle = null;
  }, 16);
};

// Simplified device detection
const detectDevice = () => {
  const newIsMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile.value !== newIsMobile) {
    isMobile.value = newIsMobile;
    
    // Toggle cursor tracking based on device
    if (newIsMobile && cursorTrackingActive.value) {
      document.removeEventListener('mousemove', updateCursorPosition);
      cursorTrackingActive.value = false;
    } else if (!newIsMobile && !cursorTrackingActive.value) {
      document.addEventListener('mousemove', updateCursorPosition, { passive: true });
      cursorTrackingActive.value = true;
    }
  }
};

// Optimized desktop cursor effect with reduced particle count
const createDesktopCursorEffect = (x: number, y: number) => {
  if (!magicConfig.value.desktopEffectEnabled || isMobile.value) return;
  
  const container = document.body;
  const effectContainer = document.createElement('div');
  effectContainer.className = 'desktop-cursor-magic-effect';
  effectContainer.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
  `;
  
  // Reduced particle count for better performance
  for (let i = 0; i < 6; i++) { // Reduced from 12 to 6
    const particle = document.createElement('div');
    particle.innerHTML = sparkleSymbols.value[i % sparkleSymbols.value.length];
    particle.style.cssText = `
      position: absolute;
      font-size: 16px;
      color: #9333ea;
      filter: drop-shadow(0 0 8px rgba(147, 51, 234, 0.8));
      animation: desktopMagicParticle 3000ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
      --angle: ${i * 60}deg;
      --distance: ${Math.random() * 80 + 40}px;
    `;
    
    effectContainer.appendChild(particle);
  }
  
  container.appendChild(effectContainer);
  
  // Cleanup with shorter duration
  setTimeout(() => {
    effectContainer.remove();
  }, 3000); // Reduced from 5000ms
};

// Optimized progressive magic enhancement with gamified audio
let magicThrottle: number | null = null;
const increaseMagicLevel = () => {
  if (magicThrottle) return; // Prevent rapid calls
  
  magicThrottle = window.setTimeout(() => {
    const oldLevel = magicLevel.value;
    magicLevel.value = Math.min(magicLevel.value + 1, 10);
    particleIntensity.value = 1 + (magicLevel.value * 0.1); // Reduced intensity
    
    // Play level up sound every few levels
    if (soundEnabled.value && magicLevel.value > oldLevel) {
      if (magicLevel.value % 3 === 0) {
        playMagicLevelUp(magicLevel.value);
      } else {
        playMagicalChord(440 + (magicLevel.value * 40), 0.3, 0.6);
      }
    }
    magicThrottle = null;
  }, 100); // 100ms throttle
};

// Enhanced gamified interaction functions
const activateMagic = () => {
  isMagicActive.value = true;
  document.documentElement.style.setProperty('--magic-active', '1');
  
  increaseMagicLevel();
  
  // Play portal activation sound
  if (soundEnabled.value) {
    playPortalActivate();
  }
};

const deactivateMagic = () => {
  isMagicActive.value = false;
  document.documentElement.style.setProperty('--magic-active', '0');
  
  // Play portal deactivation sound
  if (soundEnabled.value) {
    playPortalDeactivate();
  }
  
  // Faster magic level decrease
  setTimeout(() => {
    magicLevel.value = Math.max(magicLevel.value - 2, 0); // Faster decrease
    particleIntensity.value = 1 + (magicLevel.value * 0.1);
  }, 1000); // Reduced timeout
};

const triggerMagicalEffect = () => {
  if (isExploding.value) return; // Prevent spam clicking
  
  isExploding.value = true;
  detectDevice(); // Re-detect device
  
  // Play explosion sound
  if (soundEnabled.value) {
    playExplosionSound();
  }
  
  // Desktop cursor effect (simplified)
  if (!isMobile.value) {
    createDesktopCursorEffect(cursorPosition.value.x, cursorPosition.value.y);
  }
  
  // Simplified magical explosion
  const portal = document.querySelector('.magical-portal');
  if (portal) {
    portal.classList.add('magical-explosion');
    document.body.classList.add('magical-screen-shake');
    
    setTimeout(() => {
      portal.classList.remove('magical-explosion');
      document.body.classList.remove('magical-screen-shake');
      isExploding.value = false;
    }, 800); // Reduced duration from 1200ms
  } else {
    setTimeout(() => {
      isExploding.value = false;
    }, 800);
  }
  
  // Create optimized magical burst
  createOptimizedMagicalBurst(portal as HTMLElement | null);
};

const createOptimizedMagicalBurst = (anchor?: HTMLElement | null) => {
  const container = anchor || document.querySelector('.magical-cta');
  if (!container) return;
  
  const burstSymbols = ['✨', '⭐', '💫', '🌟']; // Reduced symbols
  
  // Single wave with fewer particles for better performance
  for (let i = 0; i < 6; i++) { // Reduced from 8 particles
    const element = document.createElement('div');
    element.innerHTML = burstSymbols[Math.floor(Math.random() * burstSymbols.length)];
    element.className = 'magical-burst-particle-enhanced';
    
    // Simplified positioning
    element.style.cssText = `
      position: absolute;
      z-index: 1000;
      pointer-events: none;
      --start-x: 50%;
      --start-y: 50%;
      --end-x: ${(Math.random() - 0.5) * 400}px;
      --end-y: ${(Math.random() - 0.5) * 400}px;
      --rotation: ${Math.random() * 720}deg;
      --scale: ${(Math.random() * 1.2 + 0.8)};
      --hue: ${(Math.random() * 60 + 240)};
    `;
    
    container.appendChild(element);
    
    // Faster cleanup
    setTimeout(() => {
      element.remove();
    }, 2500); // Reduced from 3500ms
  }
};

onMounted(() => {
  initSoundPreference();
  detectDevice();
  
  // Initialize audio context early for better user experience
  initializeAudioContext();
  
  // Add throttled cursor tracking for desktop only
  if (!isMobile.value) {
    document.addEventListener('mousemove', updateCursorPosition, { passive: true });
    cursorTrackingActive.value = true;
  }
  
  // Optimized resize handler with debouncing
  let resizeTimeout: number | null = null;
  const handleResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(detectDevice, 150);
  };
  window.addEventListener('resize', handleResize, { passive: true });
  
  // Cleanup function
  return () => {
    if (cursorTrackingActive.value) {
      document.removeEventListener('mousemove', updateCursorPosition);
    }
    window.removeEventListener('resize', handleResize);
    if (resizeTimeout) clearTimeout(resizeTimeout);
    if (cursorThrottle) clearTimeout(cursorThrottle);
    if (magicThrottle) clearTimeout(magicThrottle);
  };
});

// Removed onBeforeUnmount sound effect for better performance
</script>
