<template>
  <section id="hero" ref="root" class="hero" data-theme="paper" aria-label="Introduction">
    <div class="hero__inner container">
      <div class="hero__top mono">
        <span data-hero>{{ data.eyebrow }}</span>
        <span class="muted" data-hero>Est. {{ site.since }}</span>
      </div>

      <h1 ref="nameEl" class="hero__name display" :aria-label="data.name">
        <span v-for="(ch, i) in chars" :key="i" class="hero__mask" aria-hidden="true">
          <span class="hero__char">{{ ch }}</span>
        </span>
      </h1>

      <div class="hero__row">
        <p ref="roleEl" class="hero__role display">{{ data.role }}</p>
        <div class="hero__aside">
          <p class="hero__intro" data-hero>{{ data.intro }}</p>
          <ul class="hero__meta mono">
            <li v-for="m in data.meta" :key="m" data-hero>{{ m }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div ref="scopeEl" class="hero__scope">
      <Oscilloscope />
    </div>

    <div ref="hintEl" class="hero__hint container mono muted" data-hero>
      <span>{{ data.scrollHint }}</span>
      <i class="hero__tick" aria-hidden="true"></i>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Oscilloscope from '../components/Oscilloscope.vue';
import type { PortfolioData } from '../types';
import { site as siteState } from '../composables/useSiteState';
import { getLenis } from '../composables/useSmoothScroll';

const props = defineProps<{ data: PortfolioData['hero']; site: PortfolioData['site'] }>();

const root = ref<HTMLElement | null>(null);
const nameEl = ref<HTMLElement | null>(null);
const roleEl = ref<HTMLElement | null>(null);
const scopeEl = ref<HTMLElement | null>(null);
const hintEl = ref<HTMLElement | null>(null);

const chars = computed(() => Array.from(props.data.name));

let ctx: gsap.Context | undefined;
let tickFn: (() => void) | undefined;

const introReady = () =>
  new Promise<void>((resolve) => {
    if (siteState.introDone) return resolve();
    const stop = watch(
      () => siteState.introDone,
      (v) => {
        if (v) {
          stop();
          resolve();
        }
      }
    );
  });

const fontsReady = () => {
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  return fonts?.ready ? fonts.ready.then(() => undefined) : Promise.resolve();
};

onMounted(() => {
  if (!root.value) return;
  ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const charEls = gsap.utils.toArray<HTMLElement>('.hero__char');
      const items = gsap.utils.toArray<HTMLElement>('[data-hero]');
      let split: SplitText | undefined;

      // Hidden until the curtain lifts.
      gsap.set(charEls, { yPercent: 112 });
      gsap.set(items, { autoAlpha: 0, y: 16 });
      gsap.set(roleEl.value, { autoAlpha: 0 });
      gsap.set(scopeEl.value, { scaleX: 0, transformOrigin: '0 50%' });

      Promise.all([fontsReady(), introReady()]).then(() => {
        if (roleEl.value) {
          split = SplitText.create(roleEl.value, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
          gsap.set(split.lines, { yPercent: 112 });
          gsap.set(roleEl.value, { autoAlpha: 1 });
        }
        const tl = gsap.timeline({
          defaults: { ease: 'power4.out' },
          onComplete: () => {
            split?.revert();
            gsap.set([charEls, items], { clearProps: 'transform' });
          },
        });
        tl.to(charEls, { yPercent: 0, duration: 1.35, stagger: 0.055 }, 0)
          .to(split?.lines ?? [], { yPercent: 0, duration: 1.1, stagger: 0.09 }, 0.4)
          .to(items, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06 }, 0.55)
          .to(scopeEl.value, { scaleX: 1, duration: 1.5, ease: 'power3.inOut' }, 0.45);
      });

      // Parallax + fade as the hero leaves.
      gsap.to(nameEl.value, {
        yPercent: 24,
        ease: 'none',
        scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(hintEl.value, {
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.value, start: 'top top', end: '25% top', scrub: true },
      });

      // Kinetic skew driven by scroll velocity; only while the hero is on screen.
      let active = true;
      const skewTo = gsap.quickTo(nameEl.value, 'skewX', { duration: 0.55, ease: 'power3' });
      tickFn = () => {
        if (!active) return;
        const lenis = getLenis();
        const v = lenis && typeof lenis.velocity === 'number' ? lenis.velocity : 0;
        skewTo(gsap.utils.clamp(-9, 9, v * -0.1));
      };
      gsap.ticker.add(tickFn);
      ScrollTrigger.create({
        trigger: root.value,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          active = self.isActive;
          if (!active) skewTo(0);
        },
      });

      return () => {
        if (tickFn) gsap.ticker.remove(tickFn);
        split?.revert();
      };
    });
  }, root.value);
});

onBeforeUnmount(() => ctx?.revert());
</script>

<style scoped>
.hero {
  min-height: 100svh;
  display: grid;
  grid-template-rows: 1fr auto auto;
  padding-top: var(--nav-h);
}

.hero__inner {
  display: flex;
  flex-direction: column;
  padding-top: 2vh;
}

.hero__top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
}

.hero__top span:last-child {
  white-space: nowrap;
}

.hero__name {
  display: flex;
  margin-top: auto;
  margin-left: -0.045em;
  padding-top: 6vh;
  font-size: clamp(5.2rem, min(23.5vw, 34vh), 27rem);
  font-weight: 500;
  line-height: 0.82;
  letter-spacing: -0.035em;
  will-change: transform;
}

.hero__mask {
  display: inline-block;
  overflow: hidden;
  padding-bottom: 0.08em;
  margin-bottom: -0.08em;
}

.hero__char {
  display: inline-block;
  will-change: transform;
}

.hero__row {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 6vw;
  align-items: end;
  margin-top: clamp(20px, 4vh, 48px);
  padding-bottom: clamp(24px, 5vh, 56px);
}

.hero__role {
  font-size: clamp(1.45rem, 2.4vw + 0.45rem, 3.3rem);
  font-style: italic;
  font-weight: 400;
  line-height: 1.06;
  font-variation-settings: 'opsz' 72, 'SOFT' 60, 'WONK' 1;
  max-width: 17ch;
}

.hero__aside {
  max-width: 46ch;
  justify-self: end;
}

.hero__intro {
  font-size: clamp(1rem, 0.35vw + 0.9rem, 1.15rem);
  line-height: 1.6;
  text-wrap: pretty;
}

.hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  margin-top: 20px;
}

.hero__meta li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.hero__meta li::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}

.hero__scope {
  height: clamp(96px, 16vh, 168px);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  will-change: transform;
}

.hero__hint {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 60px;
}

.hero__tick {
  width: 1px;
  height: 18px;
  background: currentColor;
  animation: tick 1.7s var(--ease-inout) infinite;
}

@keyframes tick {
  0%   { transform: scaleY(0); transform-origin: top; }
  45%  { transform: scaleY(1); transform-origin: top; }
  55%  { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

@media (max-width: 767px) {
  .hero__name {
    font-size: clamp(4.6rem, 25vw, 9rem);
    padding-top: 4vh;
  }
  .hero__row {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .hero__aside {
    justify-self: start;
  }
  .hero__role {
    max-width: none;
  }
}
</style>
