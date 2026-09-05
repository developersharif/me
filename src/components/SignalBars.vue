<template>
  <span class="bars" role="img" :aria-label="label">
    <i v-for="n in 4" :key="n" :class="{ on: n <= level }" :style="{ height: 4 + n * 3 + 'px' }"></i>
  </span>
</template>

<script setup lang="ts">
defineProps<{ level: number; label: string }>();
</script>

<style scoped>
.bars {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 16px;
  flex-shrink: 0;
}

.bars i {
  display: block;
  width: 3px;
  background: currentColor;
  opacity: 0.22;
  border-radius: 1px;
}

.bars i.on {
  opacity: 1;
}
</style>
