<template>
  <section class="h-full flex flex-col overflow-hidden">
      <div class="flex items-center gap-3 mb-4 flex-shrink-0">
      <div class="text-2xl">📝</div>
      <h2 class="text-2xl font-bold">Articles</h2>
      <div class="ml-auto flex items-center gap-3">
        <button v-if="mediumUrl" class="text-xs px-2 py-1 rounded border border-white/10 hover:border-white/20 text-white/80"
                @click="refresh()" :disabled="loading">
          {{ loading ? 'Refreshing…' : 'Refresh' }}
        </button>
        <a v-if="mediumUrl" :href="mediumUrl" target="_blank" rel="noopener noreferrer" class="text-sm text-accent-300 hover:underline" data-interactive>View on Medium →</a>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <div v-if="error" class="rounded border border-red-500/20 bg-red-500/10 p-3 text-red-200 text-sm mb-3">{{ error }}</div>
      <div v-if="posts.length" class="grid sm:grid-cols-2 gap-4">
        <article v-for="it in posts" :key="it.guid" class="article-card">
          <div class="meta text-xs text-white/50">{{ formatDate(it.pubDate) }}</div>
          <h3 class="title"><a :href="it.link" target="_blank" rel="noopener noreferrer" data-interactive>{{ it.title }}</a></h3>
          <div class="desc" v-html="it.short"></div>
          <div class="mt-3 flex gap-2">
            <a :href="it.link" target="_blank" rel="noopener noreferrer" class="chip" data-interactive>Read</a>
            <span v-for="c in (it.categories || []).slice(0,3)" :key="c" class="tag">{{ c }}</span>
          </div>
        </article>
      </div>
      <div v-else class="rounded border border-white/10 bg-white/5 p-4 text-white/70">
        <p>No posts yet. Connect your Medium to show your latest articles.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
import { onMounted, ref, computed } from 'vue';

interface ArticlesData { medium?: string }
interface RssItem { title: string; pubDate: string; link: string; guid: string; description?: string; content?: string; categories?: string[] }
interface RssResp { status: 'ok'|'error'; items: RssItem[] }

const props = defineProps<{ data?: ArticlesData }>();
const mediumUrl = computed(() => props.data?.medium || '');

const posts = ref<Array<RssItem & { short: string }>>([]);
const loading = ref(false);
const error = ref('');

const CACHE_KEY = 'medium_posts_cache_v1';
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function safeShort(html?: string) {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || '';
  return text.length > 180 ? text.slice(0, 180) + '…' : text;
}

function formatDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

async function fetchPosts(force = false) {
  error.value = '';
  const url = mediumUrl.value;
  if (!url) return;
  const now = Date.now();
  if (!force) {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && cached.when && now - cached.when < CACHE_TTL) {
        posts.value = cached.items;
        return;
      }
    } catch {}
  }
  loading.value = true;
  try {
    let rssHandle = '';
    try {
      const u = new URL(url);
      if (u.hostname === 'medium.com') {
        // e.g. https://medium.com/@username
        const seg = u.pathname.replace(/^\//, '');
        rssHandle = seg.startsWith('@') ? seg : '@' + seg;
      } else if (u.hostname.endsWith('.medium.com')) {
        // e.g. https://username.medium.com
        const user = u.hostname.split('.')[0];
        rssHandle = '@' + user;
      }
    } catch {}
    if (!rssHandle) throw new Error('Invalid Medium URL');
    const rss = 'https://medium.com/feed/' + rssHandle;
    const endpoint = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rss);
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('Network error');
    const data = (await res.json()) as RssResp & { feed?: any };
    if (data.status !== 'ok') throw new Error('Bad response');
    const items = (data.items || []).slice(0, 6).map(it => ({
      ...it,
      short: safeShort(it.description || it.content)
    }));
    posts.value = items;
    localStorage.setItem(CACHE_KEY, JSON.stringify({ when: now, items }));
  } catch (e: any) {
    error.value = 'Could not load posts. Try opening on Medium.';
  } finally {
    loading.value = false;
  }
}

function refresh() { fetchPosts(true); }

onMounted(() => fetchPosts());
</script>

<style scoped>
.article-card {
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  padding: 12px;
}
.title { color: #fff; font-weight: 600; margin: 4px 0; }
.desc { color: rgba(255,255,255,0.75); font-size: .9rem; line-height: 1.5; }
.chip { font-size: .75rem; padding: .2rem .5rem; border: 1px solid rgba(125,211,252,.5); color: #7dd3fc; border-radius: 999px; text-decoration: none; }
.tag { font-size: .7rem; padding: .15rem .45rem; border: 1px solid rgba(255,255,255,.15); color: rgba(255,255,255,.75); border-radius: 999px; }
/* Ensure links are clickable and recognized as interactive */
.article-card a { pointer-events: auto; cursor: pointer; }
.no-flip { pointer-events: auto; }
</style>
