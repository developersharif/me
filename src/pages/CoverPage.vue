<template>
  <section class="h-full flex flex-col items-center justify-center text-center gap-6 md:gap-5 relative overflow-hidden">
    <!-- Ambient background effect -->
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-slate-900/20"></div>
    
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
    <div class="relative z-10">
  <!-- Mystical symbol -->
  <div class="mb-6 md:mb-4 text-6xl md:text-5xl opacity-60 animate-pulse-slow">
    {{ data.symbol }}
  </div>
      
      <!-- Title -->
      <div class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 md:mb-3">
        <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          {{ data.titlePrefix }}
        </span>
      </div>
      
      <div class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
        {{ data.name }}
      </div>
      
  <div class="text-accent-300 font-mono text-lg tracking-wide mb-6 md:mb-4">
  {{ data.tagline }}
      </div>
      
      <!-- Subtitle -->
  <p class="max-w-2xl text-white/70 text-lg leading-relaxed mb-8 md:mb-6">
  {{ data.subtitle }}
      </p>
      
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
          <button 
            @click="toggleSound"
            class="magical-sound-toggle"
            :class="{ 'sound-enabled': soundEnabled, 'sound-disabled': !soundEnabled }"
            :title="soundEnabled ? 'Disable magical sounds' : 'Enable magical sounds'"
          >
            <span v-if="soundEnabled" class="sound-icon">🔊</span>
            <span v-else class="sound-icon">🔇</span>
          </button>
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
        <div class="relative magical-portal" @mouseenter="activateMagic" @mouseleave="deactivateMagic">
          <!-- Multi-layered magical rings -->
          <div class="absolute inset-0 w-36 h-36 magical-ring-system">
            <!-- Outer energy ring with gradient border -->
            <div class="absolute inset-0 rounded-full magical-ring-outer">
              <div class="absolute inset-1 rounded-full magical-ring-middle"></div>
              <div class="absolute inset-3 rounded-full magical-ring-inner"></div>
            </div>
            
            <!-- Constellation of magical symbols -->
            <div v-for="(symbol, i) in magicalSymbols" :key="i" 
                 class="absolute magical-symbol"
                 :class="`symbol-${i}`"
                 :style="{ 
                   '--delay': i * 0.4 + 's',
                   '--orbit-size': (i % 2 === 0 ? 70 : 85) + 'px'
                 }"
                 @mouseenter="playSymbolHover(i)">
              <span class="symbol-glyph">{{ symbol }}</span>
            </div>
            
            <!-- Energy wisps -->
            <div v-for="i in 6" :key="`wisp-${i}`" 
                 class="absolute magical-wisp"
                 :class="`wisp-${i}`"
                 :style="{ '--wisp-delay': i * 0.8 + 's' }">
              <div class="wisp-trail"></div>
            </div>
          </div>
          
          <!-- Enhanced crystal core with layered effects -->
          <div class="relative w-36 h-36 cursor-pointer magical-crystal-container" @click="triggerMagicalEffect">
            <!-- Pulsing energy aura -->
            <div class="absolute inset-2 rounded-full magical-aura"></div>
            
            <!-- Core energy field -->
            <div class="absolute inset-4 rounded-full magical-core"></div>
            
            <!-- Inner crystal with prismatic effect -->
            <div class="absolute inset-6 rounded-full magical-crystal">
              <!-- Crystal facets -->
              <div class="absolute inset-0 crystal-facets">
                <div class="facet facet-1"></div>
                <div class="facet facet-2"></div>
                <div class="facet facet-3"></div>
              </div>
              
              <!-- Central orb -->
              <div class="relative w-full h-full flex items-center justify-center magical-orb">
                <div class="text-4xl magical-emoji">🔮</div>
              </div>
            </div>
            
            <!-- Enhanced sparkle constellation -->
            <div v-for="i in 16" :key="`sparkle-${i}`" 
                 class="absolute sparkle-enhanced"
                 :class="`sparkle-${i}`"
                 :style="{ 
                   '--sparkle-delay': i * 0.15 + 's',
                   '--sparkle-size': (Math.random() * 0.5 + 0.8) + 'rem',
                   '--sparkle-intensity': particleIntensity
                 }"
                 @mouseenter="playSparkleHover(i)">
              <span class="sparkle-glyph">{{ sparkleSymbols[i % sparkleSymbols.length] }}</span>
            </div>
          </div>
          
          <!-- Magical Progress Ring -->
          <div 
            v-if="magicLevel > 0"
            class="absolute inset-0 magical-progress-ring"
            :style="{ '--progress': (magicLevel / 10) * 100 + '%' }"
          >
            <svg class="w-full h-full" viewBox="0 0 144 144">
              <circle
                cx="72"
                cy="72"
                r="70"
                fill="none"
                stroke="rgba(147, 51, 234, 0.3)"
                stroke-width="2"
                class="progress-bg"
              />
              <circle
                cx="72"
                cy="72"
                r="70"
                fill="none"
                stroke="rgba(147, 51, 234, 0.8)"
                stroke-width="3"
                stroke-linecap="round"
                class="progress-fill"
                :stroke-dasharray="440"
                :stroke-dashoffset="440 - (440 * magicLevel / 10)"
              />
            </svg>
          </div>
          
          <!-- Ambient magical particles with trails -->
          <div class="absolute inset-0 pointer-events-none magical-particles-container">
            <div v-for="i in 12" :key="`particle-${i}`" 
                 class="absolute magical-particle-enhanced"
                 :class="`particle-${i}`"
                 :style="{ '--particle-delay': i * 0.2 + 's' }">
              <div class="particle-core"></div>
              <div class="particle-trail"></div>
            </div>
          </div>
          
          <!-- Energy vortex background -->
          <div class="absolute inset-0 magical-vortex"></div>
        </div>
        
        <!-- Premium CTA Text with advanced effects -->
        <div class="magical-text-container" :class="{ 'activated': isMagicActive }">
          <div class="magical-cta-box">
            <!-- Animated border gradient -->
            <div class="magical-border-animation"></div>
            
            <!-- Main CTA content -->
            <div class="magical-cta-content">
              <span class="magical-cta-text">{{ data.cta }}</span>
              
              <!-- Hidden runic inscription -->
              <div class="absolute inset-0 flex items-center justify-center magical-runes">
                <span class="runic-text">⟨ ᛗᚨᚷᛁᚲ ᚨᚹᚨᛁᛏᛋ ⟩</span>
              </div>
            </div>
            
            <!-- Floating micro particles -->
            <div v-for="i in 8" :key="`micro-${i}`" 
                 class="absolute micro-particle"
                 :class="`micro-${i}`">
              <div class="micro-glow"></div>
            </div>
          </div>
        </div>

        <!-- Enhanced mystical hint -->
        <div class="mt-3 inline-flex items-center gap-4 text-sm magical-hint-container">
          <span class="magical-hint-text">{{ data.hint }}</span>
          <div class="flex items-center gap-2 magical-arrow-container">
            <span class="magical-arrow">⟶</span>
            <span class="magical-trail-symbol">✦</span>
            <span class="magical-trail-symbol delay-1">✧</span>
            <span class="magical-trail-symbol delay-2">⋆</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface CoverData {
  symbol: string;
  titlePrefix: string;
  name: string;
  tagline: string;
  subtitle: string;
  cta: string;
  hint: string;
}

const props = defineProps<{ data?: CoverData }>();
const fallback: CoverData = {
  symbol: '⚡',
  titlePrefix: 'The Codex of',
  name: '[Your Name]',
  tagline: 'Fullstack Alchemist',
  subtitle: 'A chronicle of digital craftsmanship, where code becomes art and innovation meets imagination.',
  cta: 'Touch the rune to begin',
  hint: 'Swipe or press →'
};
const data = props.data ?? fallback;
if (!props.data) {
  // eslint-disable-next-line no-console
  console.warn('CoverPage: data prop missing, using fallback.');
}

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

// Audio system for magical sound effects
const audioContext = ref<AudioContext | null>(null);
const masterVolume = ref(0.3);
const soundEnabled = ref(true);

// Initialize sound preference from localStorage
const initSoundPreference = () => {
  const saved = localStorage.getItem('portfolio-sound-enabled');
  if (saved !== null) {
    soundEnabled.value = saved === 'true';
  }
};

// Save sound preference to localStorage
const saveSoundPreference = () => {
  localStorage.setItem('portfolio-sound-enabled', soundEnabled.value.toString());
};

// Initialize Web Audio API
const initializeAudio = () => {
  if (!audioContext.value && typeof window !== 'undefined') {
    try {
      audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      soundEnabled.value = false;
    }
  }
};

// Create magical sound effects using Web Audio API
const createMagicalTone = (frequency: number, duration: number, type: 'hover' | 'activate' | 'explosion' = 'hover') => {
  if (!audioContext.value || !soundEnabled.value) return;

  const oscillator = audioContext.value.createOscillator();
  const gainNode = audioContext.value.createGain();
  const filter = audioContext.value.createBiquadFilter();

  // Connect audio nodes
  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.value.destination);

  // Configure based on sound type
  switch (type) {
    case 'hover':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContext.value.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioContext.value.currentTime + duration);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioContext.value.currentTime);
      
      gainNode.gain.setValueAtTime(0, audioContext.value.currentTime);
      gainNode.gain.linearRampToValueAtTime(masterVolume.value * 0.1, audioContext.value.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.value.currentTime + duration);
      break;

    case 'activate':
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, audioContext.value.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 2, audioContext.value.currentTime + duration * 0.3);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.8, audioContext.value.currentTime + duration);
      
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, audioContext.value.currentTime);
      filter.Q.setValueAtTime(5, audioContext.value.currentTime);
      
      gainNode.gain.setValueAtTime(0, audioContext.value.currentTime);
      gainNode.gain.linearRampToValueAtTime(masterVolume.value * 0.15, audioContext.value.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.value.currentTime + duration);
      break;

    case 'explosion':
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(frequency, audioContext.value.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.3, audioContext.value.currentTime + duration);
      
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(200, audioContext.value.currentTime);
      filter.frequency.exponentialRampToValueAtTime(50, audioContext.value.currentTime + duration);
      
      gainNode.gain.setValueAtTime(0, audioContext.value.currentTime);
      gainNode.gain.linearRampToValueAtTime(masterVolume.value * 0.25, audioContext.value.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.value.currentTime + duration);
      break;
  }

  oscillator.start(audioContext.value.currentTime);
  oscillator.stop(audioContext.value.currentTime + duration);
};

// Create layered magical chord
const playMagicalChord = (baseFreq: number, duration: number) => {
  if (!soundEnabled.value) return;
  
  // Play a magical chord with harmonics
  const harmonics = [1, 1.25, 1.5, 2, 2.5];
  harmonics.forEach((harmonic, index) => {
    setTimeout(() => {
      createMagicalTone(baseFreq * harmonic, duration * 0.8, 'activate');
    }, index * 50);
  });
};

// Create sparkle sound effects
const playSparkleSound = () => {
  if (!soundEnabled.value) return;
  
  const frequencies = [800, 1000, 1200, 1500];
  frequencies.forEach((freq, index) => {
    setTimeout(() => {
      createMagicalTone(freq, 0.3, 'hover');
    }, index * 30);
  });
};

// Create random page transition sounds based on page index
const createRandomPageSound = (pageIndex: number) => {
  if (!soundEnabled.value || !audioContext.value) return;
  
  // Different sound themes for different pages
  const pageSoundThemes = [
    // Cover page (index 0) - Mystical entrance
    { baseFreq: 440, harmonics: [1, 1.25, 1.5], type: 'sine', filterFreq: 1200 },
    // About page (index 1) - Warm and personal
    { baseFreq: 523, harmonics: [1, 1.2, 1.6], type: 'triangle', filterFreq: 1000 },
    // Skills page (index 2) - Technical and precise
    { baseFreq: 659, harmonics: [1, 1.33, 1.8], type: 'square', filterFreq: 1500 },
    // Projects page (index 3) - Creative and dynamic
    { baseFreq: 349, harmonics: [1, 1.4, 2.1], type: 'sawtooth', filterFreq: 900 },
    // Experience page (index 4) - Professional and stable
    { baseFreq: 392, harmonics: [1, 1.5, 2.0], type: 'sine', filterFreq: 1100 },
    // Contact page (index 5) - Inviting and open
    { baseFreq: 494, harmonics: [1, 1.26, 1.68], type: 'triangle', filterFreq: 1300 }
  ];
  
  // Get theme for current page, or use a random one if page index is beyond defined themes
  const theme = pageSoundThemes[pageIndex] || {
    baseFreq: 330 + (Math.random() * 400),
    harmonics: [1, 1.2 + Math.random() * 0.3, 1.5 + Math.random() * 0.5],
    type: ['sine', 'triangle', 'square'][Math.floor(Math.random() * 3)] as OscillatorType,
    filterFreq: 800 + Math.random() * 800
  };
  
  // Add some randomness to make each transition unique
  const randomVariation = 0.95 + Math.random() * 0.1; // ±5% variation
  const baseFreq = theme.baseFreq * randomVariation;
  
  theme.harmonics.forEach((harmonic, index) => {
    setTimeout(() => {
      const oscillator = audioContext.value!.createOscillator();
      const gainNode = audioContext.value!.createGain();
      const filter = audioContext.value!.createBiquadFilter();
      
      // Connect audio nodes
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.value!.destination);
      
      // Configure oscillator
      oscillator.type = theme.type as OscillatorType;
      oscillator.frequency.setValueAtTime(baseFreq * harmonic, audioContext.value!.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        baseFreq * harmonic * 0.85, 
        audioContext.value!.currentTime + 0.8
      );
      
      // Configure filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(theme.filterFreq, audioContext.value!.currentTime);
      filter.frequency.exponentialRampToValueAtTime(
        theme.filterFreq * 0.7, 
        audioContext.value!.currentTime + 0.8
      );
      
      // Volume envelope (soft and pleasant)
      const volume = masterVolume.value * (0.04 + Math.random() * 0.03); // 4-7% volume
      gainNode.gain.setValueAtTime(0, audioContext.value!.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.value!.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(volume * 0.7, audioContext.value!.currentTime + 0.5);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.value!.currentTime + 0.8);
      
      oscillator.start(audioContext.value!.currentTime);
      oscillator.stop(audioContext.value!.currentTime + 0.8);
    }, index * (50 + Math.random() * 30)); // Random stagger between notes
  });
};

// Expose the page sound function globally for the Book component to use
(window as any).playPageTransitionSound = createRandomPageSound;

// Expose the sound state globally so other components can check if sound is muted
(window as any).isSoundEnabled = () => soundEnabled.value;

// Create explosion sound with multiple layers
const playExplosionSound = () => {
  if (!soundEnabled.value) return;
  
  // Deep rumble
  createMagicalTone(60, 1.2, 'explosion');
  
  // Mid-range crackle
  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createMagicalTone(200 + Math.random() * 300, 0.4, 'explosion');
      }, i * 100);
    }
  }, 100);
  
  // High sparkles
  setTimeout(() => {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        createMagicalTone(800 + Math.random() * 800, 0.6, 'hover');
      }, i * 80);
    }
  }, 200);
};

// Toggle sound on/off
const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value;
  saveSoundPreference(); // Save to localStorage
  
  // Update global sound state function
  (window as any).isSoundEnabled = () => soundEnabled.value;
  
  if (soundEnabled.value) {
    initializeAudio();
    // Play a confirmation sound
    setTimeout(() => {
      createMagicalTone(523, 0.5, 'hover');
    }, 100);
  }
};

// Play hover sound for individual symbols
const playSymbolHover = (index: number) => {
  if (!soundEnabled.value) return;
  
  const baseFreq = 440 + (index * 50); // Different frequency for each symbol
  createMagicalTone(baseFreq, 0.4, 'hover');
};

// Play hover sound for sparkles
const playSparkleHover = (index: number) => {
  if (!soundEnabled.value) return;
  
  const baseFreq = 800 + (index * 30); // Higher frequencies for sparkles
  createMagicalTone(baseFreq, 0.2, 'hover');
};

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
    portal.classList.add('magical-explosion');
    
    // Add screen shake effect
    document.body.classList.add('magical-screen-shake');
    
    // Remove classes after animation with proper cleanup
    setTimeout(() => {
      portal.classList.remove('magical-explosion');
      document.body.classList.remove('magical-screen-shake');
      isExploding.value = false;
    }, 1200);
  }
  
  // Create optimized magical burst
  createEnhancedMagicalBurst();
};

const createEnhancedMagicalBurst = () => {
  const container = document.querySelector('.magical-cta');
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
        element.style.setProperty('--start-x', '50%');
        element.style.setProperty('--start-y', '50%');
        element.style.setProperty('--end-x', (Math.random() - 0.5) * 600 + 'px');
        element.style.setProperty('--end-y', (Math.random() - 0.5) * 600 + 'px');
        element.style.setProperty('--rotation', Math.random() * 1080 + 'deg');
        element.style.setProperty('--scale', (Math.random() * 1.5 + 0.5).toString());
        element.style.setProperty('--hue', (Math.random() * 60 + 250).toString()); // Purple to blue range
        
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
  // Initialize sound preference from localStorage
  initSoundPreference();
  
  // Initialize audio system
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

<style scoped>
/* Performance optimizations */
* {
  will-change: auto;
}

.magical-cta * {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

/* Enhanced base animations with better performance */
@keyframes float {
  0%, 100% {
    transform: translate3d(0, 0px, 0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translate3d(0, -20px, 0) rotate(180deg);
    opacity: 0.7;
  }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

@keyframes glow {
  0%, 100% {
    filter: drop-shadow(0 0 5px var(--indicator-shadow, rgba(147, 51, 234, 0.3)));
  }
  50% {
    filter: drop-shadow(0 0 20px var(--indicator-shadow, rgba(147, 51, 234, 0.6)));
  }
}

/* Advanced Magical Animations */
@keyframes magical-ring-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes magical-ring-counter-rotate {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

@keyframes magical-pulse-aura {
  0%, 100% {
    box-shadow: 
      0 0 30px rgba(147, 51, 234, 0.4),
      0 0 60px rgba(79, 70, 229, 0.3),
      inset 0 0 20px rgba(147, 51, 234, 0.2);
    transform: scale(1);
  }
  50% {
    box-shadow: 
      0 0 50px rgba(147, 51, 234, 0.8),
      0 0 100px rgba(79, 70, 229, 0.6),
      inset 0 0 40px rgba(147, 51, 234, 0.4);
    transform: scale(1.02);
  }
}

@keyframes sparkle-constellation {
  0% {
    opacity: 0;
    transform: scale(0) rotate(0deg) translateZ(0);
  }
  25% {
    opacity: 0.8;
    transform: scale(var(--sparkle-size, 1)) rotate(90deg) translateZ(0);
  }
  75% {
    opacity: 1;
    transform: scale(var(--sparkle-size, 1)) rotate(270deg) translateZ(0);
  }
  100% {
    opacity: 0;
    transform: scale(0) rotate(360deg) translateZ(0);
  }
}

@keyframes magical-orbit-advanced {
  from {
    transform: rotate(0deg) translateX(var(--orbit-size, 80px)) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(var(--orbit-size, 80px)) rotate(-360deg);
  }
}

@keyframes crystal-facet-shimmer {
  0%, 100% {
    opacity: 0.1;
    transform: rotate(0deg) scale(1);
  }
  33% {
    opacity: 0.6;
    transform: rotate(120deg) scale(1.05);
  }
  66% {
    opacity: 0.4;
    transform: rotate(240deg) scale(0.95);
  }
}

@keyframes wisp-flow {
  0% {
    transform: rotate(0deg) translateX(90px) scale(0);
    opacity: 0;
  }
  20% {
    opacity: 0.6;
    transform: rotate(72deg) translateX(90px) scale(1);
  }
  80% {
    opacity: 0.3;
    transform: rotate(288deg) translateX(90px) scale(0.8);
  }
  100% {
    transform: rotate(360deg) translateX(90px) scale(0);
    opacity: 0;
  }
}

@keyframes vortex-spin {
  from {
    transform: rotate(0deg) scale(1);
    opacity: 0.1;
  }
  to {
    transform: rotate(360deg) scale(1.1);
    opacity: 0.05;
  }
}

@keyframes rune-reveal-advanced {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.5) rotateX(90deg);
    filter: blur(10px);
  }
  50% {
    opacity: 0.8;
    transform: translateY(0) scale(1.1) rotateX(0deg);
    filter: blur(2px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
    filter: blur(0);
  }
}

@keyframes magical-explosion-enhanced {
  0% {
    transform: scale(1);
    filter: brightness(1) saturate(1) hue-rotate(0deg);
  }
  30% {
    transform: scale(1.2);
    filter: brightness(3) saturate(3) hue-rotate(30deg);
  }
  60% {
    transform: scale(1.5);
    filter: brightness(2) saturate(2) hue-rotate(60deg);
  }
  100% {
    transform: scale(1);
    filter: brightness(1) saturate(1) hue-rotate(0deg);
  }
}

@keyframes magical-burst-enhanced {
  0% {
    opacity: 1;
    transform: 
      translate(var(--start-x), var(--start-y)) 
      scale(0) 
      rotate(0deg);
    filter: hue-rotate(0deg) brightness(2);
  }
  20% {
    opacity: 1;
    transform: 
      translate(var(--start-x), var(--start-y)) 
      scale(var(--scale)) 
      rotate(calc(var(--rotation) * 0.2));
  }
  100% {
    opacity: 0;
    transform: 
      translate(
        calc(var(--start-x) + var(--end-x)), 
        calc(var(--start-y) + var(--end-y))
      ) 
      scale(calc(var(--scale) * 2)) 
      rotate(var(--rotation));
    filter: hue-rotate(calc(var(--hue) * 1deg)) brightness(0.5);
  }
}

@keyframes border-flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes micro-particle-float {
  0%, 100% {
    transform: translateY(0) scale(0.8);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-15px) scale(1.2);
    opacity: 0.8;
  }
}

@keyframes screen-shake {
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-2px) rotate(0.5deg); }
  20% { transform: translateX(2px) rotate(-0.5deg); }
  30% { transform: translateX(-2px) rotate(0.5deg); }
  40% { transform: translateX(2px) rotate(-0.5deg); }
  50% { transform: translateX(-1px) rotate(0.25deg); }
  60% { transform: translateX(1px) rotate(-0.25deg); }
  70% { transform: translateX(-1px) rotate(0.25deg); }
  80% { transform: translateX(1px) rotate(-0.25deg); }
  90% { transform: translateX(-0.5px); }
}

@keyframes pulse-wave {
  0%, 100% {
    opacity: 0.6;
    transform: translateX(0);
  }
  50% {
    opacity: 1;
    transform: translateX(5px);
  }
}

/* Enhanced Magical CTA Styles */
.magical-cta {
  position: relative;
  filter: drop-shadow(0 10px 30px rgba(147, 51, 234, 0.2));
}

.magical-portal {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.magical-portal:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 40px rgba(147, 51, 234, 0.6));
}

/* Enhanced Ring System */
.magical-ring-system {
  transform-style: preserve-3d;
}

.magical-ring-outer {
  border: 3px solid transparent;
  background: 
    linear-gradient(45deg, 
      rgba(147, 51, 234, 0.8), 
      rgba(79, 70, 229, 0.8), 
      rgba(168, 85, 247, 0.8),
      rgba(147, 51, 234, 0.8)
    ),
    linear-gradient(135deg,
      rgba(59, 130, 246, 0.3),
      rgba(147, 51, 234, 0.3)
    );
  background-clip: padding-box;
  animation: magical-ring-rotate 12s linear infinite;
  filter: drop-shadow(0 0 20px rgba(147, 51, 234, 0.6));
  border-radius: 50%;
}

.magical-ring-middle {
  border: 2px solid rgba(255, 255, 255, 0.4);
  background: radial-gradient(circle, 
    rgba(147, 51, 234, 0.2) 0%, 
    transparent 60%
  );
  animation: magical-ring-counter-rotate 8s linear infinite;
  border-radius: 50%;
}

.magical-ring-inner {
  border: 1px solid rgba(168, 85, 247, 0.6);
  background: conic-gradient(
    rgba(147, 51, 234, 0.3),
    rgba(79, 70, 229, 0.3),
    rgba(168, 85, 247, 0.3),
    rgba(147, 51, 234, 0.3)
  );
  animation: magical-ring-rotate 4s linear infinite;
  border-radius: 50%;
}

/* Enhanced Crystal Container */
.magical-crystal-container {
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.magical-crystal-container:hover {
  transform: scale(1.1) rotateY(10deg);
}

.magical-aura {
  background: radial-gradient(circle,
    rgba(147, 51, 234, 0.6) 0%,
    rgba(79, 70, 229, 0.4) 40%,
    transparent 70%
  );
  animation: magical-pulse-aura 3s ease-in-out infinite;
  border-radius: 50%;
  filter: blur(2px);
}

.magical-core {
  background: radial-gradient(circle,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(147, 51, 234, 0.8) 30%,
    rgba(79, 70, 229, 0.6) 70%,
    transparent 100%
  );
  border-radius: 50%;
  animation: magical-pulse-aura 2s ease-in-out infinite;
}

.magical-crystal {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(147, 51, 234, 0.3) 30%,
    rgba(79, 70, 229, 0.4) 70%,
    rgba(168, 85, 247, 0.3) 100%
  );
  border: 2px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(15px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
}

.magical-crystal:hover {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.6) 0%,
    rgba(147, 51, 234, 0.5) 30%,
    rgba(79, 70, 229, 0.6) 70%,
    rgba(168, 85, 247, 0.5) 100%
  );
  transform: scale(1.05);
  box-shadow: 
    0 0 40px rgba(147, 51, 234, 0.8),
    inset 0 0 30px rgba(255, 255, 255, 0.3);
}

/* Crystal Facets */
.crystal-facets {
  border-radius: 50%;
  overflow: hidden;
}

.facet {
  position: absolute;
  background: linear-gradient(45deg, 
    rgba(255, 255, 255, 0.2), 
    transparent, 
    rgba(147, 51, 234, 0.1)
  );
}

.facet-1 {
  top: 0; left: 0; right: 50%; bottom: 50%;
  animation: crystal-facet-shimmer 4s ease-in-out infinite;
  clip-path: polygon(0 0, 100% 0, 0 100%);
}

.facet-2 {
  top: 0; right: 0; left: 50%; bottom: 50%;
  animation: crystal-facet-shimmer 4s ease-in-out infinite 1.33s;
  clip-path: polygon(100% 0, 100% 100%, 0 0);
}

.facet-3 {
  bottom: 0; left: 0; right: 0; top: 50%;
  animation: crystal-facet-shimmer 4s ease-in-out infinite 2.66s;
  clip-path: polygon(0 100%, 100% 100%, 50% 0);
}

.magical-orb {
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(147, 51, 234, 0.1) 50%,
    transparent 100%
  );
}

.magical-emoji {
  filter: drop-shadow(0 0 15px rgba(147, 51, 234, 1));
  transition: all 0.3s ease;
  transform-style: preserve-3d;
}

.magical-crystal:hover .magical-emoji {
  transform: scale(1.15) rotateY(15deg);
  filter: drop-shadow(0 0 25px rgba(147, 51, 234, 1));
}

/* Enhanced Magical Symbols */
.magical-symbol {
  animation: magical-orbit-advanced 15s linear infinite;
  animation-delay: var(--delay);
  filter: drop-shadow(0 0 8px rgba(147, 51, 234, 0.8));
  transition: all 0.3s ease;
}

.magical-symbol:hover {
  transform: scale(1.5);
  filter: drop-shadow(0 0 15px rgba(147, 51, 234, 1));
}

.symbol-glyph {
  font-size: 16px;
  color: rgba(168, 85, 247, 0.9);
  text-shadow: 0 0 10px rgba(147, 51, 234, 0.8);
  display: block;
  animation: magical-ring-counter-rotate 15s linear infinite;
}

/* Symbol positioning - more dynamic */
.symbol-0 { top: -15px; left: 50%; margin-left: -8px; }
.symbol-1 { top: 5px; right: -15px; }
.symbol-2 { top: 35%; right: -20px; }
.symbol-3 { bottom: 5px; right: -15px; }
.symbol-4 { bottom: -15px; left: 50%; margin-left: -8px; }
.symbol-5 { bottom: 5px; left: -15px; }
.symbol-6 { top: 35%; left: -20px; }
.symbol-7 { top: 5px; left: -15px; }

/* Enhanced Sparkles */
.sparkle-enhanced {
  animation: sparkle-constellation 3s ease-in-out infinite;
  animation-delay: var(--sparkle-delay);
  pointer-events: none;
  transform-origin: center;
}

.sparkle-glyph {
  font-size: var(--sparkle-size, 1rem);
  color: rgba(255, 255, 255, 0.9);
  filter: drop-shadow(0 0 5px rgba(147, 51, 234, 0.8));
  display: block;
}

/* Enhanced sparkle positioning */
.sparkle-0 { top: -5px; left: 20%; }
.sparkle-1 { top: 0; left: 80%; }
.sparkle-2 { top: 15%; right: -5px; }
.sparkle-3 { top: 40%; right: -10px; }
.sparkle-4 { top: 65%; right: -5px; }
.sparkle-5 { bottom: 15%; right: -5px; }
.sparkle-6 { bottom: 0; left: 80%; }
.sparkle-7 { bottom: -5px; left: 20%; }
.sparkle-8 { bottom: -5px; left: 60%; }
.sparkle-9 { bottom: 0; left: 40%; }
.sparkle-10 { bottom: 15%; left: -5px; }
.sparkle-11 { top: 65%; left: -5px; }
.sparkle-12 { top: 40%; left: -10px; }
.sparkle-13 { top: 15%; left: -5px; }
.sparkle-14 { top: 0; left: 40%; }
.sparkle-15 { top: -5px; left: 60%; }

/* Energy Wisps */
.magical-wisp {
  animation: wisp-flow 8s ease-in-out infinite;
  animation-delay: var(--wisp-delay);
}

.wisp-trail {
  width: 2px;
  height: 20px;
  background: linear-gradient(to bottom,
    rgba(147, 51, 234, 0.8),
    rgba(79, 70, 229, 0.4),
    transparent
  );
  border-radius: 1px;
  filter: blur(0.5px);
}

/* Vortex Background */
.magical-vortex {
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(147, 51, 234, 0.1) 90deg,
    transparent 180deg,
    rgba(79, 70, 229, 0.1) 270deg,
    transparent 360deg
  );
  border-radius: 50%;
  animation: vortex-spin 20s linear infinite;
  filter: blur(1px);
}

/* Enhanced Particles */
.magical-particle-enhanced {
  animation: magical-orbit-advanced 12s linear infinite;
  animation-delay: var(--particle-delay);
}

.particle-core {
  width: 3px;
  height: 3px;
  background: radial-gradient(circle,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(147, 51, 234, 0.6) 50%,
    transparent 100%
  );
  border-radius: 50%;
  filter: drop-shadow(0 0 3px rgba(147, 51, 234, 0.8));
}

.particle-trail {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1px;
  height: 8px;
  background: linear-gradient(to bottom,
    rgba(147, 51, 234, 0.6),
    transparent
  );
  transform: translate(-50%, -50%);
  filter: blur(0.5px);
}

/* Premium CTA Text Container */
.magical-text-container {
  position: relative;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.magical-cta-box {
  position: relative;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(147, 51, 234, 0.25) 50%,
    rgba(79, 70, 229, 0.2) 100%
  );
  backdrop-filter: blur(20px);
  border: 2px solid transparent;
  border-radius: 60px;
  padding: 1rem 2.5rem;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.magical-border-animation {
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, 
    rgba(147, 51, 234, 0.8),
    rgba(79, 70, 229, 0.8),
    rgba(168, 85, 247, 0.8),
    rgba(147, 51, 234, 0.8)
  );
  background-size: 300% 300%;
  border-radius: 60px;
  z-index: -1;
  animation: border-flow 3s ease-in-out infinite;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.magical-text-container.activated .magical-border-animation {
  opacity: 1;
}

.magical-cta-content {
  position: relative;
  z-index: 2;
}

.magical-cta-text {
  color: rgba(255, 255, 255, 0.95);
  font-weight: 700;
  font-size: 18px;
  transition: all 0.4s ease;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.magical-text-container.activated .magical-cta-text {
  color: rgba(255, 255, 255, 1);
  text-shadow: 
    0 0 10px rgba(147, 51, 234, 0.8),
    0 2px 4px rgba(0, 0, 0, 0.3);
  transform: scale(1.05);
}

.magical-runes {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgba(147, 51, 234, 0.9);
  font-family: serif;
  opacity: 0;
  transform: translateY(10px) scale(0.8);
}

.runic-text {
  font-size: 14px;
  letter-spacing: 2px;
  text-shadow: 0 0 15px rgba(147, 51, 234, 0.8);
}

.magical-text-container.activated .magical-runes {
  opacity: 1 !important;
  transform: translateY(0) scale(1);
  animation: rune-reveal-advanced 0.6s ease-out;
}

/* Micro Particles */
.micro-particle {
  width: 2px;
  height: 2px;
  border-radius: 50%;
  animation: micro-particle-float 3s ease-in-out infinite;
}

.micro-glow {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle,
    rgba(147, 51, 234, 0.8) 0%,
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(0.5px);
}

.micro-0 { top: 20%; left: 15%; animation-delay: 0s; }
.micro-1 { top: 30%; right: 20%; animation-delay: 0.5s; }
.micro-2 { bottom: 25%; right: 15%; animation-delay: 1s; }
.micro-3 { bottom: 35%; left: 20%; animation-delay: 1.5s; }
.micro-4 { top: 50%; left: 10%; animation-delay: 2s; }
.micro-5 { top: 60%; right: 10%; animation-delay: 2.5s; }
.micro-6 { bottom: 50%; right: 25%; animation-delay: 3s; }
.micro-7 { bottom: 60%; left: 25%; animation-delay: 3.5s; }

/* Enhanced Hint Container */
.magical-hint-container {
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.6);
}

.magical-hint-text {
  transition: all 0.3s ease;
  font-weight: 500;
}

.magical-arrow-container {
  transition: all 0.3s ease;
}

.magical-arrow {
  animation: pulse-wave 2s ease-in-out infinite;
  transition: all 0.3s ease;
}

.magical-trail-symbol {
  color: rgba(147, 51, 234, 0.6);
  animation: sparkle-constellation 2s ease-in-out infinite;
  font-size: 12px;
}

.magical-trail-symbol.delay-1 {
  animation-delay: 0.3s;
}

.magical-trail-symbol.delay-2 {
  animation-delay: 0.6s;
}

.magical-portal:hover ~ * .magical-hint-text {
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 8px rgba(147, 51, 234, 0.6);
}

/* Explosion and Burst Effects */
.magical-explosion {
  animation: magical-explosion-enhanced 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.magical-burst-particle-enhanced {
  position: absolute;
  font-size: 24px;
  pointer-events: none;
  z-index: 1000;
  animation: magical-burst-enhanced 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  filter: drop-shadow(0 0 10px rgba(147, 51, 234, 0.8));
}

.magical-screen-shake {
  animation: screen-shake 0.6s ease-in-out;
}

/* Base utility animations */
.animate-float {
  animation: float linear infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

/* Legacy compatibility */
.magical-particle {
  animation: magical-orbit-advanced 10s linear infinite;
}

.particle-0 { animation-delay: 0s; }
.particle-1 { animation-delay: -1.25s; }
.particle-2 { animation-delay: -2.5s; }
.particle-3 { animation-delay: -3.75s; }
.particle-4 { animation-delay: -5s; }
.particle-5 { animation-delay: -6.25s; }
.particle-6 { animation-delay: -7.5s; }
.particle-7 { animation-delay: -8.75s; }

.sparkle {
  font-size: 12px;
  animation: sparkle-constellation 2s ease-in-out infinite;
  animation-delay: var(--sparkle-delay);
  pointer-events: none;
}

.initial-sparkle {
  animation: magical-pulse-aura 3s ease-in-out infinite;
}

.animate-pulse-wave {
  animation: pulse-wave 1.5s ease-in-out infinite;
}

/* Responsive optimizations */
@media (max-width: 768px) {
  .magical-ring-system {
    width: 120px;
    height: 120px;
  }
  
  .magical-crystal-container {
    width: 120px;
    height: 120px;
  }
  
  .magical-aura {
    inset: 8px;
  }
  
  .magical-core {
    inset: 16px;
  }
  
  .magical-crystal {
    inset: 24px;
  }
  
  .magical-emoji {
    font-size: 2.5rem;
  }
  
  .symbol-glyph {
    font-size: 14px;
  }
  
  .sparkle-glyph {
    font-size: 0.8rem;
  }
  
  .magical-cta-text {
    font-size: 16px;
  }
  
  .runic-text {
    font-size: 12px;
  }
}

/* Performance hints */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.3s !important;
    animation-iteration-count: 1 !important;
  }
  
  .magical-ring-outer,
  .magical-ring-middle,
  .magical-ring-inner,
  .magical-symbol,
  .sparkle-enhanced,
  .magical-wisp,
  .magical-vortex,
  .magical-particle-enhanced {
    animation: none !important;
  }
}

/* Sound Toggle Button */
.magical-sound-toggle {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(147, 51, 234, 0.5);
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(147, 51, 234, 0.2) 100%
  );
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 20;
}

.magical-sound-toggle:hover {
  transform: scale(1.1);
  border-color: rgba(147, 51, 234, 0.8);
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(147, 51, 234, 0.3) 100%
  );
  box-shadow: 0 0 20px rgba(147, 51, 234, 0.4);
}

.magical-sound-toggle.sound-enabled {
  border-color: rgba(147, 51, 234, 0.8);
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(147, 51, 234, 0.25) 100%
  );
}

.magical-sound-toggle.sound-enabled::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(45deg, 
    rgba(147, 51, 234, 0.6),
    rgba(79, 70, 229, 0.6),
    rgba(168, 85, 247, 0.6)
  );
  z-index: -1;
  animation: magical-ring-rotate 3s linear infinite;
}

.magical-sound-toggle.sound-disabled {
  opacity: 0.6;
  border-color: rgba(147, 51, 234, 0.3);
}

.sound-icon {
  font-size: 18px;
  filter: drop-shadow(0 0 5px rgba(147, 51, 234, 0.8));
  transition: all 0.3s ease;
}

.magical-sound-toggle:hover .sound-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 10px rgba(147, 51, 234, 1));
}

/* Enhanced Cursor Trail */
.magical-cursor-trail {
  transition: all 0.1s ease-out;
  pointer-events: none;
  z-index: 9999;
}

.cursor-particle {
  font-size: 16px;
  animation: cursor-sparkle 2s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(147, 51, 234, 0.8));
}

@keyframes cursor-sparkle {
  0%, 100% {
    transform: scale(0.8) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 1;
  }
}

/* Enhanced Magic Level Indicators */
.magical-cta[data-magic-level="5"] .magical-portal {
  transform: scale(1.1);
  filter: drop-shadow(0 0 60px rgba(147, 51, 234, 0.8));
}

.magical-cta[data-magic-level="10"] .magical-portal {
  transform: scale(1.2) rotateY(5deg);
  filter: drop-shadow(0 0 80px rgba(147, 51, 234, 1));
}

/* Pulse intensity based on magic level */
.magical-cta[data-magic-level="5"] .magical-pulse-aura,
.magical-cta[data-magic-level="10"] .magical-pulse-aura {
  animation-duration: 1.5s;
}

/* Enhanced particle trails */
.particle-enhanced-trail {
  position: absolute;
  width: 1px;
  height: 15px;
  background: linear-gradient(to bottom,
    rgba(147, 51, 234, 0.8),
    rgba(79, 70, 229, 0.4),
    transparent
  );
  filter: blur(0.5px);
  animation: particle-trail-flow 2s ease-in-out infinite;
}

@keyframes particle-trail-flow {
  0%, 100% {
    opacity: 0.3;
    transform: scaleY(0.5);
  }
  50% {
    opacity: 0.8;
    transform: scaleY(1.2);
  }
}

/* Magical Progress Ring */
.magical-progress-ring {
  pointer-events: none;
  transform: rotate(-90deg);
  transition: all 0.5s ease;
}

.progress-fill {
  transition: stroke-dashoffset 0.5s ease;
  filter: drop-shadow(0 0 8px rgba(147, 51, 234, 0.8));
  animation: progress-glow 2s ease-in-out infinite;
}

@keyframes progress-glow {
  0%, 100% {
    filter: drop-shadow(0 0 8px rgba(147, 51, 234, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(147, 51, 234, 1));
  }
}

/* Enhanced sparkle intensity scaling */
.sparkle-enhanced[style*="--sparkle-intensity"] {
  transform: scale(var(--sparkle-intensity, 1));
}

/* Magic level visual feedback */
.magical-cta[data-magic-level="3"] {
  filter: drop-shadow(0 0 20px rgba(147, 51, 234, 0.4));
}

.magical-cta[data-magic-level="6"] {
  filter: drop-shadow(0 0 40px rgba(147, 51, 234, 0.6));
}

.magical-cta[data-magic-level="9"] {
  filter: drop-shadow(0 0 60px rgba(147, 51, 234, 0.8));
}

.magical-cta[data-magic-level="10"] {
  filter: drop-shadow(0 0 80px rgba(147, 51, 234, 1));
  animation: ultimate-magic-pulse 3s ease-in-out infinite;
}

@keyframes ultimate-magic-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}
</style>
