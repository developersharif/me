import { createApp } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import App from './App.vue';
import { vReveal } from './directives/reveal';
import { vSplit } from './directives/split';
import 'lenis/dist/lenis.css';
import './styles/main.css';

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: 'power3.out', duration: 0.8 });
ScrollTrigger.config({ ignoreMobileResize: true });

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

createApp(App).directive('reveal', vReveal).directive('split', vSplit).mount('#app');
