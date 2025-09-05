import { ref } from 'vue';

export function useMagicSound() {
  const soundEnabled = ref(true);
  const audioContext = ref<AudioContext | null>(null);
  const isAudioInitialized = ref(false);

  const initSoundPreference = () => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('portfolio-sound-enabled') : null;
    if (saved !== null) soundEnabled.value = saved === 'true';
  };

  const initializeAudioContext = async () => {
    if (typeof window === 'undefined' || audioContext.value) return;
    
    try {
      // @ts-ignore - webkitAudioContext for Safari compatibility
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume context if it's suspended (required by browser policies)
      if (audioContext.value.state === 'suspended') {
        await audioContext.value.resume();
      }
      
      isAudioInitialized.value = true;
    } catch (error) {
      console.warn('Failed to initialize audio context:', error);
      soundEnabled.value = false;
    }
  };

  const toggleSound = async () => {
    soundEnabled.value = !soundEnabled.value;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-sound-enabled', soundEnabled.value.toString());
    }
    
    // Initialize audio context when enabling sound
    if (soundEnabled.value && !isAudioInitialized.value) {
      await initializeAudioContext();
      // Play a pleasant activation chord
      setTimeout(() => playMagicalChord(523, 0.4, 0.8), 100); // C5
      setTimeout(() => playMagicalChord(659, 0.4, 0.6), 200); // E5
      setTimeout(() => playMagicalChord(783, 0.6, 0.8), 300); // G5
    } else if (!soundEnabled.value) {
      // Play a gentle farewell tone
      playMagicalChord(392, 0.5, 0.6); // G4
    }
  };

  // Enhanced gamified audio functions
  const playMagicalChord = async (frequency: number, duration: number = 0.3, intensity: number = 1) => {
    if (!soundEnabled.value || typeof window === 'undefined') return;
    
    try {
      // Initialize audio context if needed
      if (!isAudioInitialized.value) {
        await initializeAudioContext();
      }
      
      if (!audioContext.value) return;
      
      // Resume context if suspended
      if (audioContext.value.state === 'suspended') {
        await audioContext.value.resume();
      }
      
      // Create harmonic chord for richer sound
      const harmonics = [1, 1.25, 1.5, 2]; // Major chord harmonics
      const baseVolume = 0.08 * intensity;
      
      harmonics.forEach((harmonic, index) => {
        setTimeout(() => {
          const oscillator = audioContext.value!.createOscillator();
          const gainNode = audioContext.value!.createGain();
          const filter = audioContext.value!.createBiquadFilter();

          oscillator.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(audioContext.value!.destination);

          // Different wave types for harmonic richness
          const waveTypes: OscillatorType[] = ['sine', 'triangle', 'square'];
          oscillator.type = waveTypes[index % waveTypes.length];
          oscillator.frequency.value = frequency * harmonic;
          
          // Add filtering for warmth
          filter.type = 'lowpass';
          filter.frequency.value = 2000 + (intensity * 1000);
          filter.Q.value = 1;
          
          // Smooth volume envelope
          const volume = baseVolume * (1 - index * 0.2); // Decrease volume for higher harmonics
          gainNode.gain.setValueAtTime(0, audioContext.value!.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, audioContext.value!.currentTime + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.value!.currentTime + duration);
          
          oscillator.start(audioContext.value!.currentTime);
          oscillator.stop(audioContext.value!.currentTime + duration);
        }, index * 50); // Slight delay for arpeggio effect
      });
    } catch (error) {
      console.warn('Failed to play magical chord:', error);
    }
  };

  const playSparkleSound = async (pitch: number = 800) => {
    if (!soundEnabled.value) return;
    
    try {
      // Quick sparkly sound with multiple frequencies
      const sparkleFreqs = [pitch, pitch * 1.3, pitch * 1.6, pitch * 2.1];
      
      sparkleFreqs.forEach((freq, index) => {
        setTimeout(() => {
          playMagicalChord(freq, 0.15, 0.6);
        }, index * 20); // Very quick succession
      });
    } catch (error) {
      console.warn('Failed to play sparkle sound:', error);
    }
  };

  const playExplosionSound = async () => {
    if (!soundEnabled.value) return;
    
    try {
      // Multi-layered explosion effect
      // 1. Low rumble
      playMagicalChord(80, 0.8, 1.5);
      
      // 2. Mid explosion crack
      setTimeout(() => playMagicalChord(200, 0.4, 1.2), 100);
      setTimeout(() => playMagicalChord(300, 0.3, 1.0), 150);
      
      // 3. High sparkle cascade
      setTimeout(() => {
        for (let i = 0; i < 6; i++) {
          setTimeout(() => {
            const freq = 800 + Math.random() * 800;
            playMagicalChord(freq, 0.3, 0.8);
          }, i * 80);
        }
      }, 200);
      
      // 4. Final resonance
      setTimeout(() => playMagicalChord(440, 1.0, 0.6), 600);
    } catch (error) {
      console.warn('Failed to play explosion sound:', error);
    }
  };

  const playHoverSound = async (index: number = 0) => {
    if (!soundEnabled.value) return;
    
    const baseFreq = 440 + (index * 60); // Different pitch per element
    const notes = [440, 523, 659, 783, 880]; // C4, C5, E5, G5, A5 - pentatonic scale
    const freq = notes[index % notes.length];
    
    playMagicalChord(freq, 0.25, 0.7);
  };

  const playMagicLevelUp = async (level: number) => {
    if (!soundEnabled.value) return;
    
    // Ascending arpeggio for level up
    const scale = [440, 494, 554, 659, 740]; // A major pentatonic
    scale.forEach((freq, index) => {
      setTimeout(() => {
        playMagicalChord(freq, 0.4, 0.8);
      }, index * 120);
    });
    
    // Final chord
    setTimeout(() => {
      playMagicalChord(880, 0.8, 1.0); // High A
    }, 600);
  };

  const playPortalActivate = async () => {
    if (!soundEnabled.value) return;
    
    // Rising portal sound
    const startFreq = 220;
    const endFreq = 880;
    const steps = 8;
    
    for (let i = 0; i < steps; i++) {
      const freq = startFreq + ((endFreq - startFreq) * (i / steps));
      setTimeout(() => {
        playMagicalChord(freq, 0.3, 0.6 + (i * 0.1));
      }, i * 60);
    }
  };

  const playPortalDeactivate = async () => {
    if (!soundEnabled.value) return;
    
    // Falling portal sound
    const startFreq = 880;
    const endFreq = 220;
    const steps = 6;
    
    for (let i = 0; i < steps; i++) {
      const freq = startFreq - ((startFreq - endFreq) * (i / steps));
      setTimeout(() => {
        playMagicalChord(freq, 0.25, 0.8 - (i * 0.1));
      }, i * 80);
    }
  };

  // Initialize audio on first user interaction
  const setupAudioOnInteraction = () => {
    const handleFirstInteraction = async () => {
      if (soundEnabled.value && !isAudioInitialized.value) {
        await initializeAudioContext();
      }
      
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });
  };

  // Setup interaction listeners on composable creation
  if (typeof window !== 'undefined') {
    setupAudioOnInteraction();
  }

  return {
    soundEnabled,
    isAudioInitialized,
    initSoundPreference,
    initializeAudioContext,
    toggleSound,
    playMagicalChord,
    playSparkleSound,
    playExplosionSound,
    playHoverSound,
    playMagicLevelUp,
    playPortalActivate,
    playPortalDeactivate
  };
}