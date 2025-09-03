<template>
  <section class="h-full flex flex-col gap-6 justify-center relative overflow-hidden">
    <!-- Chapter header -->
    <div class="flex items-center gap-4 mb-6 flex-shrink-0">
      <div class="text-3xl">📮</div>
      <div>
        <h2 class="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Chapter V: The Envoy
        </h2>
        <p class="text-white/60 text-sm font-mono">Establishing connections across realms</p>
      </div>
    </div>
    
    <!-- Mystical contact form -->
    <div class="max-w-md mx-auto w-full space-y-6 flex-1 flex flex-col justify-center overflow-y-auto">
      <!-- Message -->
      <div class="text-center space-y-4">
        <div class="text-6xl animate-pulse-slow">🔮</div>
        <p class="text-white/80 text-lg leading-relaxed">
          The Codex awaits your message. Whether you seek collaboration, have questions about the craft, 
          or simply wish to connect with a fellow digital alchemist...
        </p>
        <p class="text-cyan-300 font-medium">The portal is open.</p>
      </div>
      
      <!-- Contact runes/buttons -->
      <div class="space-y-4">
        <!-- Email rune -->
  <a :href="'mailto:' + data.email" 
           class="contact-rune group flex items-center gap-4 p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg hover:from-blue-600/30 hover:to-cyan-600/30 hover:border-blue-400/60 transition-all duration-300">
          <div class="text-2xl group-hover:scale-110 transition-transform">✉️</div>
          <div class="flex-1">
      <div class="font-semibold text-white">Send a Digital Scroll</div>
      <div class="text-sm text-white/70">{{ data.email }}</div>
          </div>
          <div class="text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
        </a>
        
        <!-- GitHub rune -->
    <a :href="data.github" 
           class="contact-rune group flex items-center gap-4 p-4 bg-gradient-to-r from-gray-600/20 to-slate-600/20 border border-gray-500/30 rounded-lg hover:from-gray-600/30 hover:to-slate-600/30 hover:border-gray-400/60 transition-all duration-300">
          <div class="text-2xl group-hover:scale-110 transition-transform">⚡</div>
          <div class="flex-1">
      <div class="font-semibold text-white">View the Code Vault</div>
      <div class="text-sm text-white/70">GitHub Repository</div>
          </div>
          <div class="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
        </a>
        
        <!-- LinkedIn rune -->
    <a :href="data.linkedin" 
           class="contact-rune group flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-lg hover:from-indigo-600/30 hover:to-purple-600/30 hover:border-indigo-400/60 transition-all duration-300">
          <div class="text-2xl group-hover:scale-110 transition-transform">🌐</div>
          <div class="flex-1">
      <div class="font-semibold text-white">Professional Network</div>
      <div class="text-sm text-white/70">LinkedIn Profile</div>
          </div>
          <div class="text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
        </a>
        
        <!-- CV/Resume rune -->
    <a :href="data.cv" 
           class="contact-rune group flex items-center gap-4 p-4 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-lg hover:from-amber-600/30 hover:to-orange-600/30 hover:border-amber-400/60 transition-all duration-300">
          <div class="text-2xl group-hover:scale-110 transition-transform">📜</div>
          <div class="flex-1">
            <div class="font-semibold text-white">The Sealed Scroll</div>
            <div class="text-sm text-white/70">Download CV/Resume</div>
          </div>
          <div class="text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">↓</div>
        </a>
      </div>
      
      <!-- Footer message -->
      <div class="text-center pt-6 border-t border-white/10">
        <p class="text-white/60 text-sm">
          "In the realm of code, connections forge the strongest spells."
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface ContactData { email: string; github: string; linkedin: string; cv: string }
const props = defineProps<{ data?: ContactData }>();
const data = props.data ?? { email: 'your@example.com', github: '#', linkedin: '#', cv: '/cv.pdf' };
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

.contact-rune {
  cursor: pointer;
  text-decoration: none;
}

.contact-rune:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}
</style>
