<template>
  <section class="h-full flex flex-col overflow-hidden">
    <h2 class="text-2xl font-bold mb-4 flex-shrink-0">Projects</h2>
    <div class="flex-1 overflow-y-auto">
      <!-- Featured product banner (if present) -->
      <div v-if="featured" class="project-card mb-4">
        <div class="thumb" style="background: linear-gradient(135deg, rgba(16,185,129,0.25), rgba(99,102,241,0.22));">
          <div class="shine"></div>
          <img v-if="featured.image" :src="`/${featured.image}`" :alt="featured.title" class="thumb-image" />
          <div v-else class="thumb-label">Featured</div>
        </div>
        <div class="content">
          <h3 class="title">{{ featured.title }}</h3>
          <p class="desc">{{ featured.desc }}</p>
          <div v-if="featured.tech?.length" class="tags">
            <span v-for="t in featured.tech" :key="t" class="tag">{{ t }}</span>
          </div>
          <div class="meta">
            <a :href="featured.link" target="_blank" class="chip chip-live">Open</a>
            <a v-if="featured.repo && featured.repo !== '#'" :href="featured.repo" target="_blank" class="chip">Code</a>
          </div>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 gap-4 min-h-fit">
        <article v-for="p in data" :key="p.title" class="project-card h-fit">
          <div class="thumb">
            <div class="shine"></div>
            <img v-if="p.image" :src="`/${p.image}`" :alt="p.title" class="thumb-image" />
            <div v-else class="thumb-label">Preview</div>
          </div>
          <div class="content">
            <h3 class="title">{{ p.title }}</h3>
            <p class="desc">{{ p.desc }}</p>
            <div v-if="p.tech?.length" class="tags">
              <span v-for="t in p.tech" :key="t" class="tag">{{ t }}</span>
            </div>
            <div class="meta">
              <a :href="p.link" target="_blank" class="chip chip-live">Live</a>
              <a :href="p.repo" target="_blank" class="chip">Code</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type Project = { title: string; desc: string; link: string; repo: string; tech?: string[]; image?: string };
const props = defineProps<{ data?: Project[] }>();
const featured = (props.data ?? []).find(p => (p as any).featured);
const data = (props.data ?? []).filter(p => !(p as any).featured);
</script>

<style scoped>
.project-card {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}
.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
  border-color: rgba(255,255,255,0.25);
}
.thumb {
  position: relative;
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, rgba(14,165,233,0.2), rgba(99,102,241,0.18));
  display: grid;
  place-items: center;
  color: rgba(125,211,252,1);
  overflow: hidden;
}
.thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.thumb .shine {
  position: absolute;
  inset: -40% -40% auto auto;
  width: 120%; height: 120%;
  background: radial-gradient(600px 120px at 80% 110%, rgba(255,255,255,0.25), transparent 60%);
  opacity: .0;
  transition: opacity .3s ease;
}
.project-card:hover .thumb .shine { opacity: .6; }
.thumb-label {
  font-size: .8rem;
  color: rgba(255,255,255,.7);
}
.content { padding: 1rem; }
.title { font-weight: 600; color: #fff; margin-bottom: .25rem; }
.desc { font-size: .9rem; color: rgba(255,255,255,.75); line-height: 1.5; }
.tags { margin-top: .5rem; display: flex; flex-wrap: wrap; gap: .35rem; }
.tag {
  font-size: .7rem;
  padding: .15rem .45rem;
  border-radius: 9999px;
  border: 1px solid rgba(125,211,252,.25);
  color: rgba(125,211,252,.85);
  background: rgba(12,74,110,.25);
}
.meta { margin-top: .5rem; display: flex; gap: .5rem; font-size: .75rem; }
.chip {
  padding: .25rem .5rem;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,.8);
  text-decoration: none;
}
.chip:hover { border-color: rgba(255,255,255,0.35); }
.chip-live { border-color: rgba(125,211,252,.6); color: #7dd3fc; }
</style>
