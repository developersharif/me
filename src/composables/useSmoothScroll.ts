import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './useSiteState';

let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

/**
 * Lenis drives wheel/trackpad smoothing on desktop while leaving touch
 * scrolling native (syncTouch: false), so mobile keeps its platform feel.
 * ScrollTrigger is fed from Lenis' scroll event and GSAP's ticker.
 */
export function initSmoothScroll(): Lenis | null {
  if (lenis || typeof window === 'undefined') return lenis;
  lenis = new Lenis({
    lerp: 0.085,
    smoothWheel: true,
    syncTouch: false,
    anchors: false,
    autoRaf: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function destroySmoothScroll() {
  if (tick) gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
  tick = null;
}

export function getLenis() {
  return lenis;
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.body.classList.toggle('is-locked', locked);
}

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export function scrollToTarget(
  target: string | HTMLElement | number,
  opts: { offset?: number; immediate?: boolean; duration?: number } = {}
) {
  const reduce = prefersReducedMotion();
  const immediate = reduce || !!opts.immediate;
  if (lenis) {
    lenis.scrollTo(target, {
      offset: opts.offset ?? 0,
      duration: opts.duration ?? 1.4,
      easing: easeOutQuart,
      immediate,
    });
    return;
  }
  const behavior: ScrollBehavior = immediate ? 'auto' : 'smooth';
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0);
  window.scrollTo({ top, behavior });
}
