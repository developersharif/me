<template>
  <section id="work" ref="root" class="chapter work" data-theme="ink" aria-labelledby="work-title">
    <div class="container">
      <div class="chapter__head mono">
        <span class="index">{{ index }}</span>
        <span>Work</span>
        <span class="muted work__count">{{ pad(data.featured.length) }} selected</span>
      </div>
      <div class="work__intro">
        <h2 id="work-title" v-split class="h2 display">{{ data.heading }}</h2>
        <p v-reveal="{ delay: 0.2 }" class="lede muted">{{ data.intro }}</p>
      </div>
    </div>

    <div ref="pinEl" class="work__pin">
      <div ref="trackEl" class="work__track">
        <article
          v-for="(p, i) in data.featured"
          :key="p.id"
          v-reveal="{ y: 36, media: '(max-width: 1023px)' }"
          class="card"
        >
          <div class="card__media">
            <WorkPlate :project="p" :eager="i === 0" sizes="(min-width: 1024px) 72vw, 100vw" />
          </div>
          <div class="card__body">
            <div class="card__head">
              <div class="card__meta mono">
                <span class="accent">{{ pad(i + 1) }}</span>
                <span v-if="p.kicker" class="muted">{{ p.kicker }}</span>
              </div>
              <h3 class="card__title display">{{ p.title }}</h3>
            </div>
            <div class="card__info">
              <p class="card__desc">{{ p.desc }}</p>
              <ul v-if="p.tech?.length" class="card__tech mono muted">
                <li v-for="t in p.tech" :key="t">{{ t }}</li>
              </ul>
              <div v-if="p.link || p.repo" class="card__links">
                <a v-if="p.link" :href="p.link" target="_blank" rel="noopener noreferrer" class="btn" data-cursor="Visit">
                  Visit <ArrowUpRight :size="16" :stroke-width="1.75" aria-hidden="true" />
                </a>
                <a v-if="p.repo && p.repo !== p.link" :href="p.repo" target="_blank" rel="noopener noreferrer" class="btn" data-cursor="Code">
                  Source <Github :size="16" :stroke-width="1.75" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
      <div class="work__counter mono" aria-hidden="true">
        <span class="accent">{{ pad(current) }}</span>
        <span class="work__counter-rail"><i :style="{ transform: `scaleX(${current / data.featured.length})` }"></i></span>
        <span class="muted">{{ pad(data.featured.length) }}</span>
      </div>
    </div>

    <div class="container work__more">
      <h3 v-reveal class="h3 work__more-title">{{ data.moreTitle }}</h3>
      <ul v-reveal.children="{ y: 18, stagger: 0.06 }" class="more">
        <li v-for="m in data.more" :key="m.title">
          <component
            :is="m.link ? 'a' : 'div'"
            :href="m.link"
            :target="m.link ? '_blank' : undefined"
            :rel="m.link ? 'noopener noreferrer' : undefined"
            class="more__row"
            :data-cursor="m.link ? 'Open' : undefined"
          >
            <span class="more__title">{{ m.title }}</span>
            <span class="more__desc muted">{{ m.desc }}</span>
            <span class="more__tech mono muted">{{ (m.tech || []).join(' · ') }}</span>
            <span class="more__arrow" aria-hidden="true">
              <ArrowUpRight v-if="m.link" :size="18" :stroke-width="1.75" />
            </span>
          </component>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { ArrowUpRight, Github } from 'lucide-vue-next';
import WorkPlate from '../components/WorkPlate.vue';
import type { PortfolioData } from '../types';

const props = defineProps<{ data: PortfolioData['work']; index: string }>();

const root = ref<HTMLElement | null>(null);
const pinEl = ref<HTMLElement | null>(null);
const trackEl = ref<HTMLElement | null>(null);
const current = ref(1);

const pad = (n: number) => String(n).padStart(2, '0');

let ctx: gsap.Context | undefined;

onMounted(() => {
  if (!root.value || !pinEl.value || !trackEl.value) return;
  ctx = gsap.context(() => {
    const mm = gsap.matchMedia();
    const n = props.data.featured.length;

    // Desktop: pinned horizontal strip driven by vertical scroll.
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const track = trackEl.value as HTMLElement;
      const pin = pinEl.value as HTMLElement;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          pin: true,
          scrub: 0.5,
          start: 'top top',
          end: () => '+=' + distance(),
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            current.value = Math.min(n, Math.floor(self.progress * n) + 1);
          },
        },
      });

      // Parallax inside each plate, keyed to horizontal progress.
      gsap.utils.toArray<HTMLElement>('.card__media .plate > *').forEach((media) => {
        gsap.fromTo(
          media,
          { xPercent: -5, scale: 1.12 },
          {
            xPercent: 5,
            scale: 1.12,
            ease: 'none',
            scrollTrigger: {
              trigger: media.closest('.card') as HTMLElement,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          }
        );
      });
    });

  }, root.value);
});

onBeforeUnmount(() => ctx?.revert());
</script>

<style scoped>
.work__count {
  margin-left: auto;
}

.work__intro {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: clamp(24px, 5vw, 96px);
  align-items: end;
}

.work__intro .lede {
  max-width: 40ch;
}

/* Track ------------------------------------------------------------ */
.work__pin {
  position: relative;
  margin-top: clamp(48px, 8vh, 96px);
}

.work__track {
  display: flex;
  gap: clamp(28px, 4vw, 72px);
  padding-inline: var(--gutter);
}

.card {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2vh, 24px);
}

.card__media {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 6px;
}

.card__body {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 16px clamp(24px, 4vw, 64px);
  align-items: start;
}

.card__meta {
  display: flex;
  gap: 14px;
  margin-bottom: 10px;
}

.card__title {
  font-size: clamp(1.9rem, 2.3vw + 0.6rem, 3.4rem);
  line-height: 1;
}

.card__desc {
  font-size: clamp(1rem, 0.3vw + 0.92rem, 1.1rem);
  line-height: 1.55;
  max-width: 48ch;
  text-wrap: pretty;
}

.card__tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin-top: 14px;
}

.card__links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.work__counter {
  display: none;
}

/* Desktop: pinned horizontal strip */
@media (min-width: 1024px) {
  .work__pin {
    height: 100vh;
    padding-top: calc(var(--nav-h) + 3vh);
    display: flex;
    align-items: flex-start;
    overflow: hidden;
  }

  .work__track {
    width: max-content;
    will-change: transform;
  }

  .card {
    flex: 0 0 auto;
    width: min(74vw, 1120px, calc((100vh - 330px) * 1.6));
  }

  .card__media .plate > * {
    will-change: transform;
  }

  .work__counter {
    position: absolute;
    left: var(--gutter);
    bottom: max(24px, 4vh);
    display: inline-flex;
    align-items: center;
    gap: 14px;
  }

  .work__counter-rail {
    width: 96px;
    height: 1px;
    background: var(--line);
    overflow: hidden;
  }

  .work__counter-rail i {
    display: block;
    height: 100%;
    background: var(--accent);
    transform-origin: 0 50%;
    transition: transform 0.4s var(--ease-out);
  }
}

@media (max-width: 1023px) {
  .work__intro {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .work__track {
    flex-direction: column;
    gap: clamp(48px, 9vh, 96px);
  }
  .card__body {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* Index of smaller projects ---------------------------------------- */
.work__more {
  margin-top: clamp(72px, 12vh, 140px);
}

.work__more-title {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
}

.more__row {
  display: grid;
  grid-template-columns: minmax(180px, 1.1fr) 1.8fr minmax(120px, auto) 24px;
  gap: 8px 24px;
  align-items: baseline;
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
  transition: padding-left 0.45s var(--ease-out), color 0.3s ease;
}

a.more__row:hover {
  padding-left: 12px;
}

a.more__row:hover .more__title {
  color: var(--accent-text);
}

.more__title {
  font-weight: 600;
  font-size: 1.05rem;
  transition: color 0.3s ease;
}

.more__desc {
  font-size: 0.98rem;
}

.more__arrow {
  justify-self: end;
  opacity: 0.6;
  transition: transform 0.4s var(--ease-out), opacity 0.3s ease;
}

a.more__row:hover .more__arrow {
  opacity: 1;
  transform: translate(2px, -2px);
}

@media (max-width: 767px) {
  .more__row {
    grid-template-columns: 1fr 24px;
  }
  .more__tech {
    grid-column: 1 / -1;
  }
}
</style>
