<template>
  <section id="experience" class="chapter xp" data-theme="ink" aria-labelledby="xp-title">
    <div class="container">
      <div class="chapter__head mono">
        <span class="index">{{ index }}</span>
        <span>Log</span>
      </div>

      <div class="xp__grid">
        <div class="xp__intro">
          <h2 id="xp-title" v-split class="h2 display">{{ data.heading }}</h2>
          <p v-reveal="{ delay: 0.2 }" class="lede muted">{{ data.intro }}</p>
        </div>

        <ol v-reveal.children="{ y: 22, stagger: 0.08 }" class="xp__list">
          <li v-for="(e, i) in data.entries" :key="e.title + e.period" class="xp__row">
            <span class="xp__period mono muted">{{ e.period }}</span>
            <div class="xp__main">
              <h3 class="xp__title h3">{{ e.title }}</h3>
              <span class="xp__org mono accent">{{ e.org }}</span>
            </div>
            <p class="xp__desc muted">{{ e.desc }}</p>
            <span class="xp__num mono muted" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PortfolioData } from '../types';

defineProps<{ data: PortfolioData['experience']; index: string }>();
</script>

<style scoped>
.xp__grid {
  display: grid;
  grid-template-columns: 4fr 8fr;
  gap: clamp(32px, 6vw, 120px);
  align-items: start;
}

.xp__intro .lede {
  margin-top: 20px;
  max-width: 30ch;
}

.xp__row {
  position: relative;
  display: grid;
  grid-template-columns: 150px 1.1fr 1.3fr 32px;
  gap: 10px 28px;
  align-items: start;
  padding: 28px 0;
  border-top: 1px solid var(--line);
  transition: padding-left 0.5s var(--ease-out);
}

.xp__row:last-child {
  border-bottom: 1px solid var(--line);
}

.xp__row:hover {
  padding-left: 10px;
}

.xp__period {
  padding-top: 0.55em;
}

.xp__title {
  font-size: clamp(1.35rem, 1.2vw + 0.7rem, 1.9rem);
}

.xp__org {
  display: inline-block;
  margin-top: 8px;
}

.xp__desc {
  font-size: 1rem;
  padding-top: 0.35em;
}

.xp__num {
  justify-self: end;
  padding-top: 0.55em;
  opacity: 0.45;
}

@media (max-width: 1023px) {
  .xp__grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 767px) {
  .xp__row {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 22px 0;
  }
  .xp__num {
    display: none;
  }
}
</style>
