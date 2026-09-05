/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: '#F3EEE4',
        ink: '#0F0E0C',
        vermilion: '#FF4F1F',
      },
    },
  },
  corePlugins: { preflight: false },
  plugins: [],
};
