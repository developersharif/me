import type { Directive } from 'vue';
import { gsap } from 'gsap';

export interface RevealOptions {
  y?: number;
  children?: boolean;
  stagger?: number;
  delay?: number;
  duration?: number;
  /** Percentage of the viewport height the element must clear before revealing. */
  margin?: number;
  /** Extra media query gate, e.g. '(max-width: 1023px)'. */
  media?: string;
}

const KEY = '__revealMM';

/**
 * v-reveal — fade/rise an element (or its children with `.children`) the
 * first time it enters the viewport. Uses IntersectionObserver so it never
 * depends on cached scroll positions (mobile address-bar resizes, deep links).
 * No-op under prefers-reduced-motion: nothing is ever hidden for those users.
 */
export const vReveal: Directive<HTMLElement, RevealOptions | undefined> = {
  mounted(el, binding) {
    const o = binding.value || {};
    const children = o.children ?? !!binding.modifiers.children;
    const targets = children ? (Array.from(el.children) as HTMLElement[]) : [el];
    if (!targets.length) return;

    const query = ['(prefers-reduced-motion: no-preference)', o.media].filter(Boolean).join(' and ');
    const mm = gsap.matchMedia();
    mm.add(query, () => {
      gsap.set(targets, { autoAlpha: 0, y: o.y ?? 32 });
      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: o.duration ?? 1.05,
          delay: o.delay ?? 0,
          stagger: o.stagger ?? 0.07,
          ease: 'power3.out',
          overwrite: 'auto',
          clearProps: 'transform,opacity,visibility',
        });
      };
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            play();
            io.disconnect();
          }
        },
        { rootMargin: `0px 0px -${o.margin ?? 8}% 0px`, threshold: 0 }
      );
      io.observe(el);
      return () => {
        io.disconnect();
        if (!played) gsap.set(targets, { clearProps: 'transform,opacity,visibility' });
      };
    });
    (el as unknown as Record<string, unknown>)[KEY] = mm;
  },
  unmounted(el) {
    const mm = (el as unknown as Record<string, unknown>)[KEY] as gsap.MatchMedia | undefined;
    mm?.revert();
  },
};
