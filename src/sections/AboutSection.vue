<template>
  <section id="about" ref="root" class="chapter about" data-theme="paper" aria-labelledby="about-title">
    <div class="container">
      <div class="chapter__head mono">
        <span class="index">{{ index }}</span>
        <span>Story</span>
      </div>

      <div class="about__grid">
        <div class="about__aside">
          <div class="about__sticky">
            <h2 id="about-title" v-split class="h2 display">{{ data.heading }}</h2>
            <p v-reveal="{ delay: 0.25 }" class="lede muted about__lede">{{ data.lede }}</p>
            <figure v-if="data.plates[0]" v-reveal="{ delay: 0.35 }" class="plate plate--small">
              <div class="plate__frame plate__frame--tilt">
                <img
                  :src="workSrc(data.plates[0].slug, 800)"
                  :srcset="workSrcset(data.plates[0].slug)"
                  sizes="(min-width: 1024px) 20vw, 55vw"
                  :width="data.plates[0].w"
                  :height="data.plates[0].h"
                  :alt="data.plates[0].alt"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption class="mono muted">{{ data.plates[0].caption }}</figcaption>
            </figure>
          </div>
        </div>

        <div class="about__body">
          <div v-reveal.children="{ y: 24 }" class="prose about__story">
            <p v-for="(p, i) in data.story" :key="i" v-html="p"></p>
          </div>

          <div class="about__block">
            <h3 v-reveal class="h3">{{ data.highlightsTitle }}</h3>
            <ul v-reveal.children="{ y: 18, stagger: 0.08 }" class="about__list">
              <li v-for="h in data.highlights" :key="h.text">
                <component :is="icon(h.icon)" :size="18" :stroke-width="1.75" aria-hidden="true" class="about__icon" />
                <span>{{ h.text }}</span>
              </li>
            </ul>
          </div>

          <div class="about__focus">
            <div v-reveal.children="{ y: 16, stagger: 0.06 }">
              <h3 class="mono accent about__focus-title">{{ data.focus.researchTitle }}</h3>
              <ul class="about__bullets">
                <li v-for="t in data.focus.research" :key="t">{{ t }}</li>
              </ul>
            </div>
            <div v-reveal.children="{ y: 16, stagger: 0.06, delay: 0.1 }">
              <h3 class="mono accent about__focus-title">{{ data.focus.learningTitle }}</h3>
              <ul class="about__bullets">
                <li v-for="t in data.focus.learning" :key="t">{{ t }}</li>
              </ul>
            </div>
          </div>

          <figure v-if="data.plates[1]" v-reveal class="plate">
            <div class="plate__frame">
              <img
                :src="workSrc(data.plates[1].slug, 1600)"
                :srcset="workSrcset(data.plates[1].slug)"
                sizes="(min-width: 1024px) 50vw, 100vw"
                :width="data.plates[1].w"
                :height="data.plates[1].h"
                :alt="data.plates[1].alt"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption class="mono muted">{{ data.plates[1].caption }}</figcaption>
          </figure>
        </div>
      </div>

      <div ref="tlEl" class="timeline">
        <div class="timeline__head">
          <h3 v-reveal class="h3">{{ data.timelineTitle }}</h3>
          <span v-reveal class="mono muted">Since {{ firstYear }} · {{ years }} years in</span>
        </div>
        <ol class="timeline__list">
          <div class="timeline__spine" aria-hidden="true"><span ref="spineFill"></span></div>
          <li v-for="(t, i) in data.timeline" :key="i" class="timeline__item">
            <span class="timeline__year display">{{ t.year }}</span>
            <span class="timeline__dot" aria-hidden="true"></span>
            <div class="timeline__text">
              <h4 class="timeline__title">{{ t.title }}</h4>
              <p class="muted">{{ t.desc }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Layers, Smartphone, Sparkles, Terminal } from 'lucide-vue-next';
import type { PortfolioData } from '../types';
import { workSrc, workSrcset } from '../composables/useAssets';

const props = defineProps<{ data: PortfolioData['about']; index: string }>();

const root = ref<HTMLElement | null>(null);
const tlEl = ref<HTMLElement | null>(null);
const spineFill = ref<HTMLElement | null>(null);

const icons = { cpu: Cpu, smartphone: Smartphone, layers: Layers, terminal: Terminal } as const;
const icon = (name: string) => icons[name as keyof typeof icons] ?? Sparkles;

const firstYear = computed(() => {
  const ys = props.data.timeline.map((t) => parseInt(t.year, 10)).filter(Number.isFinite);
  return ys.length ? Math.min(...ys) : '';
});
const years = computed(() => {
  const y = Number(firstYear.value);
  return Number.isFinite(y) ? Math.max(0, new Date().getFullYear() - y) : 0;
});

let ctx: gsap.Context | undefined;

onMounted(() => {
  if (!tlEl.value) return;
  ctx = gsap.context(() => {
    const items = gsap.utils.toArray<HTMLElement>('.timeline__item');
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        spineFill.value,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.timeline__list', start: 'top 72%', end: 'bottom 72%', scrub: true },
        }
      );
      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 72%',
          onEnter: () => item.classList.add('is-lit'),
          onLeaveBack: () => item.classList.remove('is-lit'),
        });
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      items.forEach((item) => item.classList.add('is-lit'));
      gsap.set(spineFill.value, { scaleY: 1 });
    });
  }, tlEl.value);
});

onBeforeUnmount(() => ctx?.revert());
</script>

<style scoped>
.about__grid {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: clamp(40px, 6vw, 110px);
  align-items: start;
}

.about__aside {
  align-self: stretch;
}

.about__sticky {
  position: sticky;
  top: calc(var(--nav-h) + 28px);
}

.about__lede {
  margin-top: clamp(20px, 3vh, 32px);
  max-width: 36ch;
}

.about__body {
  max-width: 62ch;
  font-size: clamp(1.05rem, 0.35vw + 0.95rem, 1.2rem);
  line-height: 1.65;
}

.about__story {
  text-wrap: pretty;
}

.about__block {
  margin-top: clamp(40px, 6vh, 64px);
}

.about__list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

.about__list li {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 14px 0;
  border-top: 1px solid var(--line);
  font-size: 1rem;
}

.about__list li:last-child {
  border-bottom: 1px solid var(--line);
}

.about__icon {
  flex-shrink: 0;
  margin-top: 4px;
  color: var(--accent-text);
}

.about__focus {
  margin-top: clamp(40px, 6vh, 64px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.about__focus-title {
  margin-bottom: 12px;
}

.about__bullets li {
  position: relative;
  padding: 6px 0 6px 18px;
  font-size: 1rem;
}

.about__bullets li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.95em;
  width: 8px;
  height: 1px;
  background: currentColor;
  opacity: 0.6;
}

/* Plates ----------------------------------------------------------- */
.plate {
  margin-top: clamp(40px, 6vh, 64px);
}

.plate--small {
  max-width: 250px;
}

.plate__frame {
  overflow: hidden;
  border-radius: 4px;
  background: #e6dfd2;
  box-shadow: 0 18px 40px -22px rgba(15, 14, 12, 0.45);
}

.plate__frame--tilt {
  transform: rotate(-2deg);
}

.plate__frame img {
  width: 100%;
  height: auto;
}

.plate figcaption {
  margin-top: 12px;
}

/* Timeline ----------------------------------------------------------- */
.timeline {
  margin-top: clamp(72px, 12vh, 140px);
}

.timeline__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 24px;
}

.timeline__list {
  position: relative;
  display: flex;
  flex-direction: column;
}

.timeline__spine {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--year-w) + var(--dot-w) / 2);
  width: 1px;
  background: var(--line);
}

.timeline__spine span {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--accent);
  transform-origin: 50% 0;
  transform: scaleY(0);
}

.timeline__list {
  --year-w: 150px;
  --dot-w: 32px;
}

.timeline__item {
  display: grid;
  grid-template-columns: var(--year-w) var(--dot-w) 1fr;
  align-items: start;
  gap: 0 24px;
  padding: 22px 0;
}

.timeline__year {
  font-size: clamp(1.5rem, 1.6vw + 0.6rem, 2.4rem);
  font-weight: 400;
  color: var(--muted);
  line-height: 1;
  transition: color 0.5s ease;
}

.timeline__dot {
  position: relative;
  justify-self: center;
  width: 9px;
  height: 9px;
  margin-top: 0.45em;
  border-radius: 50%;
  border: 1px solid var(--muted);
  background: var(--bg);
  transition: background-color 0.4s ease, border-color 0.4s ease, transform 0.5s var(--ease-out);
}

.timeline__title {
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 4px;
}

.timeline__text p {
  font-size: 0.98rem;
}

.timeline__text {
  opacity: 0.55;
  transform: translateX(6px);
  transition: opacity 0.5s ease, transform 0.6s var(--ease-out);
}

.timeline__item.is-lit .timeline__year {
  color: var(--accent-text);
}

.timeline__item.is-lit .timeline__dot {
  background: var(--accent);
  border-color: var(--accent);
  transform: scale(1.35);
}

.timeline__item.is-lit .timeline__text {
  opacity: 1;
  transform: none;
}

@media (max-width: 1023px) {
  .about__grid {
    grid-template-columns: 1fr;
  }
  .about__sticky {
    position: static;
  }
  .about__body {
    max-width: none;
  }
  .plate--small {
    max-width: 220px;
  }
}

@media (max-width: 640px) {
  .about__focus {
    grid-template-columns: 1fr;
  }
  .timeline__list {
    --year-w: 64px;
    --dot-w: 20px;
  }
  .timeline__item {
    gap: 0 12px;
    padding: 18px 0;
  }
}
</style>
