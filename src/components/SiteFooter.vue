<template>
  <footer class="footer">
    <div class="container footer__inner">
      <span class="mono muted">© {{ year }} {{ site.name }}</span>
      <span class="mono muted footer__stack">{{ site.stack }}</span>
      <button type="button" class="mono link-ul footer__top" @click="top">Back to top ↑</button>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { scrollToTarget } from '../composables/useSmoothScroll';

defineProps<{ site: { name: string; stack: string } }>();
const year = new Date().getFullYear();
const top = () => scrollToTarget(0);
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--line);
  padding: 22px 0 max(22px, env(safe-area-inset-bottom));
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
}

.footer__top {
  min-height: 44px;
}

@media (max-width: 640px) {
  .footer__stack { display: none; }
}
</style>
