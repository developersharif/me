<template>
  <section class="h-full flex flex-col overflow-hidden">
    <h2 class="text-2xl font-bold mb-4 flex-shrink-0">Experience & Activity</h2>
    <div class="flex-1 overflow-y-auto">
      <ul class="space-y-3">
  <li v-for="item in data" :key="item.title" class="p-3 rounded bg-white/5 border border-white/10">
          <div class="font-semibold">{{ item.title }}</div>
          <div class="text-xs text-white/60">{{ item.time }}</div>
          <p class="text-sm text-white/70 leading-relaxed">{{ item.desc }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
type ExperienceItem = { title: string; time: string; desc: string };
const props = defineProps<{ data?: ExperienceItem[] }>();
const data = props.data ?? [];
</script>
