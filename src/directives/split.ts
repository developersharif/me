import type { Directive } from 'vue';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

export interface SplitOptions {
  stagger?: number;
  duration?: number;
  margin?: number;
}

const KEY = '__splitMM';

/**
 * v-split — masked line-by-line rise for headings, re-split on resize.
 * Waits for fonts so line breaks are measured with the real typeface, and
 * plays via IntersectionObserver so it is independent of cached scroll math.
 */
export const vSplit: Directive<HTMLElement, SplitOptions | undefined> = {
  mounted(el, binding) {
    const o = binding.value || {};
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      let split: SplitText | undefined;
      let io: IntersectionObserver | undefined;
      let cancelled = false;
      let seen = false;
      let done = false;
      let pending: gsap.core.Tween | undefined;

      const run = () => {
        if (cancelled) return;
        split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          linesClass: 'split-line',
          onSplit: (self) => {
            const tw = gsap.from(self.lines, {
              yPercent: 108,
              duration: o.duration ?? 1.15,
              stagger: o.stagger ?? 0.09,
              ease: 'power4.out',
              paused: true,
              onComplete: () => {
                done = true;
              },
            });
            if (done) tw.progress(1);
            else if (seen) tw.play();
            else pending = tw;
            return tw;
          },
        });
        io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              seen = true;
              pending?.play();
              io?.disconnect();
            }
          },
          { rootMargin: `0px 0px -${o.margin ?? 8}% 0px`, threshold: 0 }
        );
        io.observe(el);
      };

      const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
      if (fonts?.ready) fonts.ready.then(run);
      else run();

      return () => {
        cancelled = true;
        io?.disconnect();
        split?.revert();
      };
    });
    (el as unknown as Record<string, unknown>)[KEY] = mm;
  },
  unmounted(el) {
    const mm = (el as unknown as Record<string, unknown>)[KEY] as gsap.MatchMedia | undefined;
    mm?.revert();
  },
};
