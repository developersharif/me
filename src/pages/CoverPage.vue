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

        <!-- Magical Cursor Effect -->
        <div 
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import CoverHeader from '../components/cover/CoverHeader.vue';
import CoverPortal from '../components/cover/CoverPortal.vue';
// Removed CoverCtaText and CoverHint per request
import SoundToggle from '../components/cover/SoundToggle.vue';
import { useMagicSound } from '../composables/useMagicSound';

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

// Cursor tracking for magical trail
const cursorPosition = ref({ x: 0, y: 0 });
const cursorStyle = ref({
  left: '0px',
  top: '0px',
  opacity: '0'
});

// Enhanced visual effects
const particleIntensity = ref(1);
const magicLevel = ref(0);

// Audio via composable (keep interaction sounds only; no page-change sound)
const { audioContext, soundEnabled, initSoundPreference, initializeAudio, toggleSound, createMagicalTone, playMagicalChord, playSparkleSound, playExplosionSound } = useMagicSound();

// Hover helpers (keep signatures)
const playSymbolHover = (index: number) => { if (!soundEnabled.value) return; createMagicalTone(440 + index * 50, 0.4, 'hover'); };
const playSparkleHover = (index: number) => { if (!soundEnabled.value) return; createMagicalTone(800 + index * 30, 0.2, 'hover'); };

// Enhanced cursor tracking
const updateCursorPosition = (event: MouseEvent) => {
  cursorPosition.value = { x: event.clientX, y: event.clientY };
  cursorStyle.value = {
    left: event.clientX - 10 + 'px',
    top: event.clientY - 10 + 'px',
    opacity: isMagicActive.value ? '1' : '0.5'
  };
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
  
  // Play dramatic explosion sound
  playExplosionSound();
  
  // Enhanced magical explosion with better performance
  const portal = document.querySelector('.magical-portal');
  if (portal) {
    // Stronger effect: portal blast + page shake
    portal.classList.add('magical-explosion');
    document.body.classList.add('magical-screen-shake');
    
    // Remove classes after animation with proper cleanup
    setTimeout(() => {
      portal.classList.remove('magical-explosion');
      document.body.classList.remove('magical-screen-shake');
      isExploding.value = false;
    }, 1200);
  }
  
  // Create optimized magical burst
  createEnhancedMagicalBurst(portal as HTMLElement | null);
};

const createEnhancedMagicalBurst = (anchor?: HTMLElement | null) => {
  const container = anchor || document.querySelector('.magical-cta');
  if (!container) return;
  
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
        
        fragment.appendChild(element);
        
        // Cleanup with proper memory management
        setTimeout(() => {
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        }, 3000);
      }
      container.appendChild(fragment);
    }, wave * 200);
  }
};

onMounted(() => {
  initSoundPreference();
  initializeAudio();
  
  // Add cursor tracking for magical trail
  document.addEventListener('mousemove', updateCursorPosition);
  
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
  };
});

// Play soft transition sound when navigating away from cover page
onBeforeUnmount(() => {
  if (soundEnabled.value) {
    createRandomPageSound(1); // Transitioning from cover (0) to about (1)
  }
});
</script>
