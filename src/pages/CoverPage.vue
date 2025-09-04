<template>
  <section class="cover-responsive h-full flex flex-col items-center justify-center text-center gap-6 md:gap-5 relative overflow-hidden py-6 md:py-8">
    <!-- Professional background photo with overlays -->
    <div class="absolute inset-0 -z-10">
      <img 
        v-if="data.background"
        :src="resolveAsset(data.background)"
        alt="Workstation background"
        class="w-full h-full object-cover opacity-30 md:opacity-40 scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-indigo-950/50 to-purple-950/50"></div>
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,.15),transparent_60%)]"></div>
  <div class="absolute inset-0 pointer-events-none cover-noise"></div>
    </div>
    
    <!-- Floating particles -->
    <div class="absolute inset-0">
      <div v-for="i in 20" :key="i" 
           class="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
           :style="{
             left: Math.random() * 100 + '%',
             top: Math.random() * 100 + '%',
             animationDelay: Math.random() * 4 + 's',
             animationDuration: (Math.random() * 3 + 2) + 's'
           }">
      </div>
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
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import CoverHeader from '../components/cover/CoverHeader.vue';
import CoverPortal from '../components/cover/CoverPortal.vue';
// Removed CoverCtaText and CoverHint per request
import SoundToggle from '../components/cover/SoundToggle.vue';
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

// Enhanced magical effects state
const isMagicActive = ref(false);
const magicalSymbols = ref(['✦', '⟐', '⬟', '◊', '⬢', '⟡', '◈', '⬣']);
const sparkleSymbols = ref(['✨', '⭐', '💫', '🌟', '✧', '⋆', '✦', '✩']);
const isExploding = ref(false);

// Device detection for proper magic effects
const isMobile = ref(false);
const isTouch = ref(false);

// Desktop cursor effect state
const desktopCursorEffect = ref(null);
const desktopEffectActive = ref(false);
const cursorPosition = ref({ x: 0, y: 0 });

// Enhanced cursor tracking for magical trail
const cursorStyle = ref({
  left: '0px',
  top: '0px',
  opacity: '0'
});

// Enhanced visual effects
const particleIntensity = ref(1);
const magicLevel = ref(0);

// Magic configuration from theme
const magicConfig = computed(() => themeConfig.magicEffects || {
  desktopCursorEffectDuration: 5000,
  mobileEffectEnabled: true,
  desktopEffectEnabled: true,
  cursorTrailIntensity: 1.2,
  particleBurstCount: 12
});

// Audio via composable (keep interaction sounds only; no page-change sound)
const { audioContext, soundEnabled, initSoundPreference, initializeAudio, toggleSound, createMagicalTone, playMagicalChord, playSparkleSound, playExplosionSound } = useMagicSound();

// Hover helpers (keep signatures)
const playSymbolHover = (index: number) => { if (!soundEnabled.value) return; createMagicalTone(440 + index * 50, 0.4, 'hover'); };
const playSparkleHover = (index: number) => { if (!soundEnabled.value) return; createMagicalTone(800 + index * 30, 0.2, 'hover'); };

// Enhanced cursor tracking with better precision
const updateCursorPosition = (event: MouseEvent) => {
  const rect = document.documentElement.getBoundingClientRect();
  cursorPosition.value = { 
    x: event.clientX - rect.left, 
    y: event.clientY - rect.top 
  };
  
  cursorStyle.value = {
    left: (event.clientX - 10) + 'px',
    top: (event.clientY - 10) + 'px',
    opacity: isMagicActive.value ? String(magicConfig.value.cursorTrailIntensity) : '0.5'
  };
};

// Device detection function with better window resize handling
const detectDevice = () => {
  const newIsMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const newIsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Update device state
  const deviceChanged = isMobile.value !== newIsMobile;
  isMobile.value = newIsMobile;
  isTouch.value = newIsTouch;
  
  // If device type changed, update cursor tracking accordingly
  if (deviceChanged) {
    if (newIsMobile) {
      // Remove cursor tracking for mobile
      document.removeEventListener('mousemove', updateCursorPosition);
    } else {
      // Add cursor tracking for desktop
      document.addEventListener('mousemove', updateCursorPosition);
    }
  }
};

// Create desktop cursor magic effect
const createDesktopCursorEffect = (x: number, y: number) => {
  if (!magicConfig.value.desktopEffectEnabled || isMobile.value) return;
  
  const container = document.body;
  const effectContainer = document.createElement('div');
  effectContainer.className = 'desktop-cursor-magic-effect';
  effectContainer.style.position = 'fixed';
  effectContainer.style.left = x + 'px';
  effectContainer.style.top = y + 'px';
  effectContainer.style.pointerEvents = 'none';
  effectContainer.style.zIndex = '9999';
  effectContainer.style.transform = 'translate(-50%, -50%)';
  
  // Create multiple magic particles
  for (let i = 0; i < magicConfig.value.particleBurstCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'desktop-magic-particle';
    particle.innerHTML = sparkleSymbols.value[i % sparkleSymbols.value.length];
    particle.style.position = 'absolute';
    particle.style.fontSize = '16px';
    particle.style.color = '#9333ea';
    particle.style.filter = 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.8))';
    particle.style.animation = `desktopMagicParticle ${magicConfig.value.desktopCursorEffectDuration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`;
    particle.style.setProperty('--angle', (i * 30) + 'deg');
    particle.style.setProperty('--distance', (Math.random() * 100 + 50) + 'px');
    
    effectContainer.appendChild(particle);
  }
  
  container.appendChild(effectContainer);
  
  // Remove effect after duration
  setTimeout(() => {
    if (effectContainer.parentNode) {
      effectContainer.parentNode.removeChild(effectContainer);
    }
  }, magicConfig.value.desktopCursorEffectDuration);
};

// Progressive magic enhancement
const increaseMagicLevel = () => {
  magicLevel.value = Math.min(magicLevel.value + 1, 10);
  particleIntensity.value = 1 + (magicLevel.value * 0.2);
  
  // Play progression sound
  if (soundEnabled.value && magicLevel.value % 3 === 0) {
    createMagicalTone(440 + (magicLevel.value * 50), 0.6, 'activate');
  }
};

// Performance optimized interaction functions
const activateMagic = () => {
  isMagicActive.value = true;
  // Add performance hint for animations
  document.documentElement.style.setProperty('--magic-active', '1');
  
  // Increase magic intensity
  increaseMagicLevel();
  
  // Play magical hover sound
  playMagicalChord(440, 1.0);
  playSparkleSound();
};

const deactivateMagic = () => {
  isMagicActive.value = false;
  document.documentElement.style.setProperty('--magic-active', '0');
  
  // Gradually decrease magic level
  setTimeout(() => {
    magicLevel.value = Math.max(magicLevel.value - 1, 0);
    particleIntensity.value = 1 + (magicLevel.value * 0.2);
  }, 2000);
  
  // Play subtle deactivation sound
  createMagicalTone(330, 0.8, 'hover');
};

const triggerMagicalEffect = () => {
  if (isExploding.value) return; // Prevent spam clicking
  
  isExploding.value = true;
  
  // Re-detect device on each click to handle window resizing
  detectDevice();
  
  // Always show the main magical burst effects
  // Device-specific effects are additive, not exclusive
  const showMainEffects = true;
  const showDesktopCursorEffect = !isMobile.value && magicConfig.value.desktopEffectEnabled;
  
  // Play dramatic explosion sound
  playExplosionSound();
  
  // Create desktop cursor effect at current cursor position (desktop only)
  if (showDesktopCursorEffect) {
    createDesktopCursorEffect(cursorPosition.value.x, cursorPosition.value.y);
  }
  
  // Enhanced magical explosion with better performance
  const portal = document.querySelector('.magical-portal');
  if (portal && showMainEffects) {
    // Stronger effect: portal blast + page shake
    portal.classList.add('magical-explosion');
    document.body.classList.add('magical-screen-shake');
    
    // Remove classes after animation with proper cleanup
    setTimeout(() => {
      portal.classList.remove('magical-explosion');
      document.body.classList.remove('magical-screen-shake');
      isExploding.value = false;
    }, 1200);
  } else {
    // Fallback in case portal is not found
    setTimeout(() => {
      isExploding.value = false;
    }, 1200);
  }
  
  // Create optimized magical burst (always show)
  if (showMainEffects) {
    createEnhancedMagicalBurst(portal as HTMLElement | null);
  }
};

const createEnhancedMagicalBurst = (anchor?: HTMLElement | null) => {
  const container = anchor || document.querySelector('.magical-cta');
  if (!container) {
    console.warn('No container found for magical burst effect');
    return;
  }
  
  // Create document fragment for better performance
  const fragment = document.createDocumentFragment();
  const burstSymbols = ['✨', '⭐', '💫', '🌟', '⚡', '✦', '💎', '🔥', '⭐', '🌠'];
  
  // Create multiple waves of magical elements
  for (let wave = 0; wave < 3; wave++) {
    setTimeout(() => {
      for (let i = 0; i < 8; i++) {
        const element = document.createElement('div');
        element.innerHTML = burstSymbols[Math.floor(Math.random() * burstSymbols.length)];
        element.className = 'magical-burst-particle-enhanced';
        
        // Optimized positioning with CSS custom properties
        // Emit from center of the portal
        element.style.setProperty('--start-x', '50%');
        element.style.setProperty('--start-y', '50%');
        element.style.setProperty('--end-x', (Math.random() - 0.5) * 600 + 'px');
        element.style.setProperty('--end-y', (Math.random() - 0.5) * 600 + 'px');
        element.style.setProperty('--rotation', Math.random() * 1080 + 'deg');
        element.style.setProperty('--scale', (Math.random() * 1.8 + 0.6).toString());
        element.style.setProperty('--hue', (Math.random() * 90 + 240).toString()); // broader purple-blue range
        
        // Force immediate visibility
        element.style.position = 'absolute';
        element.style.zIndex = '1000';
        element.style.pointerEvents = 'none';
        
        container.appendChild(element);
        
        // Cleanup with proper memory management
        setTimeout(() => {
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        }, 3500); // Slightly longer to ensure animation completes
      }
    }, wave * 200);
  }
};

onMounted(() => {
  initSoundPreference();
  initializeAudio();
  
  // Detect device type for proper magic effects
  detectDevice();
  
  // Add cursor tracking for magical trail (desktop only)
  if (!isMobile.value) {
    document.addEventListener('mousemove', updateCursorPosition);
  }
  
  // Handle window resize for device detection
  window.addEventListener('resize', detectDevice);
  
  // Add some initial sparkle to the crystal
  setTimeout(() => {
    const crystal = document.querySelector('.magical-crystal');
    if (crystal) {
      crystal.classList.add('initial-sparkle');
      // Play a gentle welcome sound
      createMagicalTone(523, 1.5, 'hover'); // C5 note
    }
  }, 1000);
  
  // Enable audio on first user interaction (required by browsers)
  const enableAudio = () => {
    if (audioContext.value && audioContext.value.state === 'suspended') {
      audioContext.value.resume();
    }
    document.removeEventListener('click', enableAudio);
    document.removeEventListener('touchstart', enableAudio);
  };
  
  document.addEventListener('click', enableAudio);
  document.addEventListener('touchstart', enableAudio);
  
  // Cleanup on unmount
  return () => {
    document.removeEventListener('mousemove', updateCursorPosition);
    document.removeEventListener('click', enableAudio);
    document.removeEventListener('touchstart', enableAudio);
    window.removeEventListener('resize', detectDevice);
  };
});

// Play soft transition sound when navigating away from cover page
onBeforeUnmount(() => {
  if (soundEnabled.value) {
    createMagicalTone(330, 0.5, 'hover'); // Soft transition sound
  }
});
</script>
