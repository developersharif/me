import { ref } from 'vue';

export type MagicalToneType = 'hover' | 'activate' | 'explosion';

export function useMagicSound() {
  const audioContext = ref<AudioContext | null>(null);
  const masterVolume = ref(0.3);
  const soundEnabled = ref(true);

  const initSoundPreference = () => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('portfolio-sound-enabled') : null;
    if (saved !== null) soundEnabled.value = saved === 'true';
  };

  const saveSoundPreference = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-sound-enabled', soundEnabled.value.toString());
    }
  };

  const initializeAudio = () => {
    if (!audioContext.value && typeof window !== 'undefined') {
      try {
        // @ts-expect-error - webkitAudioContext for Safari
        audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Web Audio API not supported:', error);
        soundEnabled.value = false;
      }
    }
  };

  const createMagicalTone = (frequency: number, duration: number, type: MagicalToneType = 'hover') => {
    if (!audioContext.value || !soundEnabled.value) return;

    const oscillator = audioContext.value.createOscillator();
    const gainNode = audioContext.value.createGain();
    const filter = audioContext.value.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.value.destination);

    switch (type) {
      case 'hover': {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.value.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioContext.value.currentTime + duration);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, audioContext.value.currentTime);
        gainNode.gain.setValueAtTime(0, audioContext.value.currentTime);
        gainNode.gain.linearRampToValueAtTime(masterVolume.value * 0.1, audioContext.value.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.value.currentTime + duration);
        break;
      }
      case 'activate': {
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
      }
      case 'explosion': {
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
    }

    oscillator.start(audioContext.value.currentTime);
    oscillator.stop(audioContext.value.currentTime + duration);
  };

  const playMagicalChord = (baseFreq: number, duration: number) => {
    if (!soundEnabled.value) return;
    const harmonics = [1, 1.25, 1.5, 2, 2.5];
    harmonics.forEach((harmonic, index) => {
      setTimeout(() => {
        createMagicalTone(baseFreq * harmonic, duration * 0.8, 'activate');
      }, index * 50);
    });
  };

  const playSparkleSound = () => {
    if (!soundEnabled.value) return;
    const frequencies = [800, 1000, 1200, 1500];
    frequencies.forEach((freq, index) => {
      setTimeout(() => createMagicalTone(freq, 0.3, 'hover'), index * 30);
    });
  };

  const playExplosionSound = () => {
    if (!soundEnabled.value) return;
    createMagicalTone(60, 1.2, 'explosion');
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => createMagicalTone(200 + Math.random() * 300, 0.4, 'explosion'), i * 100);
      }
    }, 100);
    setTimeout(() => {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => createMagicalTone(800 + Math.random() * 800, 0.6, 'hover'), i * 80);
      }
    }, 200);
  };

  const createRandomPageSound = (pageIndex: number) => {
    if (!soundEnabled.value || !audioContext.value) return;
    const pageSoundThemes = [
      { baseFreq: 440, harmonics: [1, 1.25, 1.5], type: 'sine', filterFreq: 1200 },
      { baseFreq: 523, harmonics: [1, 1.2, 1.6], type: 'triangle', filterFreq: 1000 },
      { baseFreq: 659, harmonics: [1, 1.33, 1.8], type: 'square', filterFreq: 1500 },
      { baseFreq: 349, harmonics: [1, 1.4, 2.1], type: 'sawtooth', filterFreq: 900 },
      { baseFreq: 392, harmonics: [1, 1.5, 2.0], type: 'sine', filterFreq: 1100 },
      { baseFreq: 494, harmonics: [1, 1.26, 1.68], type: 'triangle', filterFreq: 1300 }
    ];

    const theme = (pageSoundThemes as any)[pageIndex] || {
      baseFreq: 330 + (Math.random() * 400),
      harmonics: [1, 1.2 + Math.random() * 0.3, 1.5 + Math.random() * 0.5],
      type: ['sine', 'triangle', 'square'][Math.floor(Math.random() * 3)] as OscillatorType,
      filterFreq: 800 + Math.random() * 800
    };

    const randomVariation = 0.95 + Math.random() * 0.1;
    const baseFreq = theme.baseFreq * randomVariation;

    theme.harmonics.forEach((harmonic: number, index: number) => {
      setTimeout(() => {
        const oscillator = audioContext.value!.createOscillator();
        const gainNode = audioContext.value!.createGain();
        const filter = audioContext.value!.createBiquadFilter();
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.value!.destination);
        oscillator.type = theme.type as OscillatorType;
        oscillator.frequency.setValueAtTime(baseFreq * harmonic, audioContext.value!.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(baseFreq * harmonic * 0.85, audioContext.value!.currentTime + 0.8);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(theme.filterFreq, audioContext.value!.currentTime);
        filter.frequency.exponentialRampToValueAtTime(theme.filterFreq * 0.7, audioContext.value!.currentTime + 0.8);
        const volume = masterVolume.value * (0.04 + Math.random() * 0.03);
        gainNode.gain.setValueAtTime(0, audioContext.value!.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.value!.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(volume * 0.7, audioContext.value!.currentTime + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.value!.currentTime + 0.8);
        oscillator.start(audioContext.value!.currentTime);
        oscillator.stop(audioContext.value!.currentTime + 0.8);
      }, index * (50 + Math.random() * 30));
    });
  };

  const toggleSound = () => {
    soundEnabled.value = !soundEnabled.value;
    saveSoundPreference();
    if (soundEnabled.value) {
      initializeAudio();
      setTimeout(() => createMagicalTone(523, 0.5, 'hover'), 100);
    }
  };

  return {
    audioContext,
    masterVolume,
    soundEnabled,
    initSoundPreference,
    saveSoundPreference,
    initializeAudio,
    toggleSound,
    createMagicalTone,
    playMagicalChord,
    playSparkleSound,
    playExplosionSound,
    createRandomPageSound,
  } as const;
}
