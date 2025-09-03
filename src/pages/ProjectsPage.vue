<template>
  <section class="h-full flex flex-col overflow-hidden">
    <h2 class="text-2xl font-bold mb-4 flex-shrink-0">Projects</h2>
    <div class="flex-1 overflow-y-auto">
      <div class="grid sm:grid-cols-2 gap-4 min-h-fit">
        <article v-for="p in data" :key="p.title" class="rounded overflow-hidden border border-white/10 bg-white/5 h-fit">
          <div class="aspect-video bg-gradient-to-br from-accent-800/30 to-accent-500/20 grid place-items-center text-accent-200">
            Screenshot
          </div>
          <div class="p-4">
            <h3 class="font-semibold">{{ p.title }}</h3>
            <p class="text-sm text-white/70 leading-relaxed">{{ p.desc }}</p>
            <div class="mt-2 flex gap-3 text-xs">
              <a :href="p.link" target="_blank" class="text-accent-300 hover:underline">Live</a>
              <a :href="p.repo" target="_blank" class="text-white/60 hover:underline">Code</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type Project = { title: string; desc: string; link: string; repo: string };
const props = defineProps<{ data?: Project[] }>();
const data = props.data ?? [];
</script>
