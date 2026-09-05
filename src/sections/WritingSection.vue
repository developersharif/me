<template>
  <section id="writing" class="chapter writing" data-theme="ink" aria-labelledby="writing-title">
    <div class="container">
      <div class="chapter__head mono">
        <span class="index">{{ index }}</span>
        <span>Writing</span>
        <a :href="data.medium" target="_blank" rel="noopener noreferrer" class="link-ul writing__medium">Medium ↗</a>
      </div>

      <div class="writing__grid">
        <div class="writing__intro">
          <h2 id="writing-title" v-split class="h2 display">{{ data.heading }}</h2>
          <p v-reveal="{ delay: 0.2 }" class="lede muted">{{ data.intro }}</p>
        </div>

        <div class="writing__feed" aria-live="polite">
          <ul v-if="loading && !posts.length" class="feed feed--skeleton" aria-label="Loading articles">
            <li v-for="n in 4" :key="n" class="feed__row">
              <span class="sk sk--date"></span>
              <span class="sk sk--title"></span>
            </li>
          </ul>

          <ul v-else-if="posts.length" class="feed">
            <li v-for="p in posts" :key="p.guid" class="feed__row">
              <a :href="p.link" target="_blank" rel="noopener noreferrer" class="feed__link" data-cursor="Read">
                <span class="feed__date mono muted">{{ formatDate(p.pubDate) }}</span>
                <span class="feed__title">{{ p.title }}</span>
                <span class="feed__tags mono muted">{{ (p.categories || []).slice(0, 3).join(' · ') }}</span>
                <ArrowUpRight class="feed__arrow" :size="18" :stroke-width="1.75" aria-hidden="true" />
              </a>
            </li>
          </ul>

          <div v-else class="feed__empty">
            <p class="muted">{{ error || 'No posts to show right now.' }}</p>
            <a :href="data.medium" target="_blank" rel="noopener noreferrer" class="btn">
              Read on Medium <ArrowUpRight :size="16" :stroke-width="1.75" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ArrowUpRight } from 'lucide-vue-next';
import type { PortfolioData } from '../types';

const props = defineProps<{ data: PortfolioData['writing']; index: string }>();

interface RssItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  categories?: string[];
}

const posts = ref<RssItem[]>([]);
const loading = ref(false);
const error = ref('');

const CACHE_KEY = 'medium_posts_cache_v2';
const CACHE_TTL = 1000 * 60 * 30;
const LIMIT = 5;

function formatDate(d: string) {
  const dt = new Date(d);
  return Number.isNaN(dt.getTime())
    ? ''
    : dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function mediumHandle(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname === 'medium.com') {
      const seg = u.pathname.replace(/^\//, '').split('/')[0];
      return seg.startsWith('@') ? seg : '@' + seg;
    }
    if (u.hostname.endsWith('.medium.com')) return '@' + u.hostname.split('.')[0];
  } catch {
    /* ignore */
  }
  return '';
}

async function load() {
  const handle = mediumHandle(props.data.medium);
  if (!handle) return;
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached?.when && Date.now() - cached.when < CACHE_TTL && Array.isArray(cached.items)) {
      posts.value = cached.items;
      return;
    }
  } catch {
    /* ignore */
  }
  loading.value = true;
  try {
    const rss = 'https://medium.com/feed/' + handle;
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rss));
    if (!res.ok) throw new Error('network');
    const data = (await res.json()) as { status: string; items?: RssItem[] };
    if (data.status !== 'ok') throw new Error('bad');
    const items = (data.items || []).slice(0, LIMIT).map((it) => ({
      title: it.title,
      pubDate: it.pubDate,
      link: it.link,
      guid: it.guid,
      categories: it.categories,
    }));
    posts.value = items;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ when: Date.now(), items }));
    } catch {
      /* ignore */
    }
  } catch {
    error.value = 'Could not load the feed right now.';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<style scoped>
.writing__medium {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.writing__grid {
  display: grid;
  grid-template-columns: 4fr 8fr;
  gap: clamp(32px, 6vw, 120px);
  align-items: start;
}

.writing__intro .lede {
  margin-top: 20px;
  max-width: 28ch;
}

.feed__row {
  border-top: 1px solid var(--line);
}

.feed__row:last-child {
  border-bottom: 1px solid var(--line);
}

.feed__link {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) 24px;
  grid-template-areas:
    'date title arrow'
    'date tags arrow';
  gap: 8px 24px;
  align-items: baseline;
  padding: 22px 0;
  transition: padding-left 0.5s var(--ease-out);
}

.feed__link:hover {
  padding-left: 10px;
}

.feed__date {
  grid-area: date;
}

.feed__tags {
  grid-area: tags;
}

.feed__title {
  grid-area: title;
  font-family: var(--font-display);
  font-variation-settings: 'opsz' 36, 'SOFT' 40, 'WONK' 1;
  font-size: clamp(1.15rem, 0.9vw + 0.8rem, 1.6rem);
  line-height: 1.2;
  transition: color 0.3s ease;
}

.feed__link:hover .feed__title {
  color: var(--accent-text);
}

.feed__arrow {
  grid-area: arrow;
  justify-self: end;
  opacity: 0.6;
  transition: transform 0.4s var(--ease-out), opacity 0.3s ease;
}

.feed__link:hover .feed__arrow {
  opacity: 1;
  transform: translate(2px, -2px);
}

.feed--skeleton .feed__row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 24px;
  padding: 26px 0;
}

.sk {
  display: block;
  height: 12px;
  border-radius: 3px;
  background: var(--line);
  animation: shimmer 1.4s ease-in-out infinite;
}

.sk--date { width: 80px; }
.sk--title { width: 70%; height: 18px; }

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.feed__empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  padding: 28px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

@media (max-width: 1023px) {
  .writing__grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 767px) {
  .feed__link {
    grid-template-columns: minmax(0, 1fr) 24px;
    grid-template-areas:
      'date date'
      'title arrow'
      'tags tags';
    gap: 6px 12px;
  }
}
</style>
