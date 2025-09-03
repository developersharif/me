<template>
  <section class="h-full flex flex-col gap-6 relative overflow-hidden">
    <!-- Chapter header with mystical styling -->
    <div class="flex items-center gap-4 mb-4 flex-shrink-0">
      <div class="text-3xl">📜</div>
      <div>
        <h2 class="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          {{ data.header.title }}
        </h2>
        <p class="text-white/60 text-sm font-mono">{{ data.header.subtitle }}</p>
      </div>
    </div>
    
    <!-- Story content -->
    <div class="flex-1 space-y-6 overflow-y-auto overflow-x-hidden">
      <div v-if="data.sections[0]" class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 class="text-xl font-semibold text-amber-300 mb-3">{{ data.sections[0].title }}</h3>
        <p class="text-white/80 leading-relaxed">{{ data.sections[0].body }}</p>
      </div>
      
      <div v-if="data.sections[1]" class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 class="text-xl font-semibold text-blue-300 mb-3">{{ data.sections[1].title }}</h3>
        <div class="space-y-3 text-white/80">
          <div v-for="b in data.sections[1].bullets" :key="b.text" class="flex items-start gap-3">
            <span class="text-emerald-400 text-lg">{{ b.icon }}</span>
            <span>{{ b.text }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="data.sections[2]" class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 class="text-xl font-semibold text-indigo-300 mb-3">{{ data.sections[2].title }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="space-y-2">
            <div class="text-white/90 font-medium">🧪 Research Areas</div>
            <ul class="space-y-1 text-white/70 pl-4">
              <li v-for="t in data.sections[2].research" :key="t">• {{ t }}</li>
            </ul>
          </div>
          <div class="space-y-2">
            <div class="text-white/90 font-medium">📚 Learning Path</div>
            <ul class="space-y-1 text-white/70 pl-4">
              <li v-for="t in data.sections[2].learning" :key="t">• {{ t }}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Interactive timeline -->
      <div class="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-lg p-6">
        <h3 class="text-xl font-semibold text-purple-300 mb-4">Timeline of Mastery</h3>
        <div class="space-y-4">
          <div v-for="(t, idx) in data.timeline" :key="t.title" class="flex items-center gap-4 group cursor-pointer hover:bg-white/5 rounded p-2 transition-colors">
            <div :class="['w-3 h-3 rounded-full group-hover:scale-125 transition-transform', idx === 0 ? 'bg-emerald-400' : idx === 1 ? 'bg-blue-400' : 'bg-purple-400']"></div>
            <div class="flex-1">
              <div class="text-white font-medium">{{ t.year }} - {{ t.title }}</div>
              <div class="text-white/60 text-sm">{{ t.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface AboutData {
  header: { title: string; subtitle: string };
  sections: any[];
  timeline: { year: string; title: string; desc: string }[];
}

const props = defineProps<{ data?: AboutData }>();
const data = props.data ?? { header: { title: 'Chapter I: The Chronicle', subtitle: '' }, sections: [], timeline: [] };
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(147, 51, 234, 0.7);
}
</style>
