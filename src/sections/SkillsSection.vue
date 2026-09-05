<template>
  <section id="skills" class="chapter skills" data-theme="accent" aria-labelledby="skills-title">
    <Marquee :items="data.marquee" class="skills__marquee" />

    <div class="container">
      <div class="chapter__head mono">
        <span class="index">{{ index }}</span>
        <span>Stack</span>
        <span class="muted skills__count">{{ total }} tools</span>
      </div>

      <div class="skills__intro">
        <h2 id="skills-title" v-split class="h2 display">{{ data.heading }}</h2>
        <div v-reveal.children="{ y: 20 }" class="skills__legend">
          <p class="lede">{{ data.intro }}</p>
          <ul class="legend" aria-label="Proficiency legend">
            <li v-for="(lv, key) in data.levels" :key="key">
              <SignalBars :level="lv.bars" :label="lv.label" />
              <span class="mono">{{ lv.label }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="skills__groups">
        <section v-for="g in data.groups" :key="g.id" class="group" :aria-labelledby="'group-' + g.id">
          <header v-reveal class="group__head">
            <h3 :id="'group-' + g.id" class="h3">{{ g.title }}</h3>
            <p class="mono muted">{{ g.subtitle }}</p>
          </header>
          <ul v-reveal.children="{ y: 14, stagger: 0.035, duration: 0.75 }" class="group__grid">
            <li v-for="s in g.skills" :key="s.name" class="chip">
              <div class="chip__text">
                <span class="chip__name">{{ s.name }}</span>
                <span class="chip__desc">{{ s.description }}</span>
              </div>
              <SignalBars :level="data.levels[s.level].bars" :label="data.levels[s.level].label" />
            </li>
          </ul>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Marquee from '../components/Marquee.vue';
import SignalBars from '../components/SignalBars.vue';
import type { PortfolioData } from '../types';

const props = defineProps<{ data: PortfolioData['skills']; index: string }>();
const total = computed(() => props.data.groups.reduce((n, g) => n + g.skills.length, 0));
</script>

<style scoped>
.skills {
  padding-top: 0;
}

.skills__marquee {
  margin-bottom: clamp(56px, 10vh, 120px);
}

.skills__count {
  margin-left: auto;
}

.skills__intro {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: clamp(32px, 5vw, 96px);
  align-items: end;
}

.skills__legend .lede {
  max-width: 40ch;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 26px;
  margin-top: 22px;
}

.legend li {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.skills__groups {
  margin-top: clamp(56px, 9vh, 110px);
}

.group + .group {
  margin-top: clamp(44px, 7vh, 80px);
}

.group__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px 24px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 18px;
}

.group__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px;
}

.chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-height: 64px;
  padding: 12px 16px;
  border: 1px solid var(--line);
  border-radius: 6px;
  transition: background-color 0.3s ease, transform 0.4s var(--ease-out), border-color 0.3s ease;
}

.chip:hover {
  background: rgba(15, 14, 12, 0.08);
  border-color: rgba(15, 14, 12, 0.5);
  transform: translateY(-2px);
}

.chip__text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.chip__name {
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.2;
}

.chip__desc {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.02em;
  color: var(--muted);
  line-height: 1.35;
}

@media (max-width: 1023px) {
  .skills__intro {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

@media (max-width: 480px) {
  .group__grid {
    grid-template-columns: 1fr;
  }
}
</style>
