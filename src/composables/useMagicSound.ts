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

    if (soundEnabled.value && !isAudioInitialized.value) {
      await initializeAudioContext();
      // Play a sweet activation chime
      playChime([523, 659, 784], 0.12); // C5, E5, G5 quick arpeggio
    } else if (!soundEnabled.value) {
      playTone(392, 0.15, 0.3); // Soft G4
    }
  };

  // --- Core Sound Generators ---

  /**
   * Plays a single clean digital tone with smooth envelope.
   */
  const playTone = async (frequency: number, duration: number = 0.2, volume: number = 0.5) => {
    if (!soundEnabled.value || typeof window === 'undefined') return;

    try {
      if (!isAudioInitialized.value) await initializeAudioContext();
      if (!audioContext.value) return;
      if (audioContext.value.state === 'suspended') await audioContext.value.resume();

      const ctx = audioContext.value;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // Clean sine wave for "digital" feel
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      // Soft low-pass filter for warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(4000, now);
      filter.Q.setValueAtTime(0.7, now);

      // Fast attack, smooth decay (sweet sound)
      const baseVol = 0.06 * volume;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(baseVol, now + 0.01); // Fast attack
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch (error) {
      console.warn('Failed to play tone:', error);
    }
  };

  /**
   * Plays a quick arpeggio chime (sweet "tech" notification sound).
   */
  const playChime = async (frequencies: number[], gap: number = 0.08) => {
    if (!soundEnabled.value) return;
    frequencies.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.25, 0.6), i * gap * 1000);
    });
  };

  // --- User-Facing Sound Effects ---

  const playMagicalChord = async (frequency: number, duration: number = 0.3, intensity: number = 1) => {
    // Simpler, cleaner chord: just the root + fifth for a "tech" feel
    playTone(frequency, duration, 0.5 * intensity);
    setTimeout(() => playTone(frequency * 1.5, duration * 0.8, 0.3 * intensity), 30); // Fifth
  };

  const playSparkleSound = async (pitch: number = 1000) => {
    if (!soundEnabled.value) return;
    // Quick high-pitched blip
    playTone(pitch, 0.08, 0.4);
  };

  const playExplosionSound = async () => {
    if (!soundEnabled.value) return;
    // Short "thump" + sparkle cascade
    playTone(100, 0.15, 0.8); // Low thump
    setTimeout(() => playChime([600, 800, 1000, 1200], 0.04), 80); // Sparkle cascade
  };

  const playHoverSound = async (index: number = 0) => {
    if (!soundEnabled.value) return;
    // Pentatonic scale for pleasant hover
    const notes = [523, 587, 659, 784, 880]; // C5, D5, E5, G5, A5
    const freq = notes[index % notes.length];
    playTone(freq, 0.1, 0.35);
  };

  const playMagicLevelUp = async (level: number) => {
    if (!soundEnabled.value) return;
    // Rising arpeggio
    const baseFreq = 400 + level * 20;
    playChime([baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2], 0.1);
  };

  const playPortalActivate = async () => {
    if (!soundEnabled.value) return;
    // Ascending sweep
    playChime([300, 400, 500, 600, 700, 800], 0.06);
  };

  const playPortalDeactivate = async () => {
    if (!soundEnabled.value) return;
    // Descending sweep
    playChime([800, 700, 600, 500, 400], 0.07);
  };

  // Initialize audio on first user interaction
  const setupAudioOnInteraction = () => {
    const handleFirstInteraction = async () => {
      if (soundEnabled.value && !isAudioInitialized.value) {
        await initializeAudioContext();
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });
  };

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