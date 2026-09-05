<template>
  <section id="contact" class="chapter contact" data-theme="ink" aria-labelledby="contact-title">
    <div class="container">
      <div class="chapter__head mono">
        <span class="index">{{ index }}</span>
        <span>Contact</span>
        <span class="muted contact__status"><i class="pulse" aria-hidden="true"></i>{{ data.status }}</span>
      </div>

      <h2 id="contact-title" v-split class="contact__title display">{{ data.heading }}</h2>

      <div class="contact__grid">
        <p v-reveal="{ delay: 0.15 }" class="lede muted contact__line">{{ data.line }}</p>

        <div class="contact__main">
          <a
            v-reveal="{ delay: 0.25 }"
            :href="'mailto:' + data.email"
            class="contact__email display"
            data-cursor="Email"
          >
            <span>{{ data.email }}</span>
          </a>

          <div v-reveal.children="{ y: 18, stagger: 0.06, delay: 0.3 }" class="contact__links-wrap">
            <ul class="contact__links">
              <li v-for="l in data.links" :key="l.href">
                <a :href="l.href" target="_blank" rel="noopener noreferrer" class="contact__link">
                  <span class="mono">{{ l.label }}</span>
                  <ArrowUpRight :size="16" :stroke-width="1.75" aria-hidden="true" />
                </a>
              </li>
            </ul>
            <a v-if="data.cv" :href="cvHref" class="btn contact__cv" download>
              Download CV <Download :size="16" :stroke-width="1.75" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowUpRight, Download } from 'lucide-vue-next';
import type { PortfolioData } from '../types';
import { asset } from '../composables/useAssets';

const props = defineProps<{ data: PortfolioData['contact']; index: string }>();
const cvHref = computed(() => (props.data.cv?.startsWith('http') ? props.data.cv : asset(props.data.cv)));
</script>

<style scoped>
.contact {
  padding-bottom: clamp(64px, 10vh, 120px);
}

.contact__status {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0 rgba(255, 79, 31, 0.6);
  animation: pulse 2.2s ease-out infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 79, 31, 0.55); }
  70% { box-shadow: 0 0 0 12px rgba(255, 79, 31, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 79, 31, 0); }
}

.contact__title {
  font-size: clamp(2.8rem, 7.6vw + 0.4rem, 9rem);
  max-width: 12ch;
}

.contact__grid {
  display: grid;
  grid-template-columns: 4fr 8fr;
  gap: clamp(32px, 6vw, 120px);
  align-items: start;
  margin-top: clamp(40px, 7vh, 88px);
}

.contact__line {
  max-width: 34ch;
}

.contact__email {
  display: inline-block;
  font-size: clamp(1.45rem, 3.6vw + 0.2rem, 4.6rem);
  font-weight: 400;
  line-height: 1.05;
  overflow-wrap: anywhere;
  transition: color 0.3s ease;
}

.contact__email span {
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-size: 100% 2px;
  background-position: 0 100%;
  padding-bottom: 0.08em;
  transition: background-size 0.5s var(--ease-out);
}

.contact__email:hover {
  color: var(--accent-text);
}

.contact__email:hover span {
  background-size: 0% 2px;
  background-position: 100% 100%;
}

.contact__links-wrap {
  margin-top: clamp(36px, 6vh, 64px);
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px 40px;
}

.contact__links {
  display: grid;
  grid-template-columns: repeat(2, minmax(160px, auto));
  gap: 0 40px;
}

.contact__link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding-right: 8px;
  transition: color 0.3s ease;
}

.contact__link svg {
  opacity: 0.55;
  transition: transform 0.4s var(--ease-out), opacity 0.3s ease;
}

.contact__link:hover {
  color: var(--accent-text);
}

.contact__link:hover svg {
  opacity: 1;
  transform: translate(2px, -2px);
}

@media (max-width: 1023px) {
  .contact__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

@media (max-width: 480px) {
  .contact__links {
    grid-template-columns: 1fr;
  }
}
</style>
