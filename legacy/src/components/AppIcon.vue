<template>
  <component
    :is="IconComp"
    :size="numericSize"
    :stroke-width="numericStroke"
    :class="tw"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as Lucide from 'lucide-vue-next';

const props = withDefaults(defineProps<{
  name: string | number;
  size?: number | string;
  strokeWidth?: number | string;
  tw?: string;
}>(), {
  size: 18,
  strokeWidth: 2,
  tw: 'text-emerald-400'
});

type IconKey = keyof typeof Lucide;

const numericSize = computed(() => Number(props.size));
const numericStroke = computed(() => Number(props.strokeWidth));

const emojiMap: Record<string, IconKey | undefined> = {
  '⚡': 'Zap',
  '✨': 'Sparkles',
  '⭐': 'Star',
  '💫': 'Sparkles',
  '🌟': 'Star',
  '✧': 'Sparkles',
  '✦': 'Sparkles',
  '💎': 'Gem',
  '🔥': 'Flame',
  '🔮': 'Orbit' as IconKey,
  '🖥️': 'Monitor',
  '🛠️': 'Wrench',
  '🐞': 'Bug',
  '⚙️': 'Settings',
  '✉': 'Mail',
  '💻': 'Laptop',
  // sound-related emojis
  '🔈': 'Volume1',
  '🔉': 'Volume',
  '🔊': 'Volume2',
  '🔇': 'VolumeX'
};

const nameMap: Record<string, IconKey | undefined> = {
  bolt: 'Zap',
  sparkles: 'Sparkles',
  star: 'Star',
  gem: 'Gem',
  flame: 'Flame',
  laptop: 'Laptop',
  computer: 'Monitor',
  wrench: 'Wrench',
  bug: 'Bug',
  settings: 'Settings',
  code: 'Code2',
  book: 'BookOpen',
  timeline: 'Timer',
  mail: 'Mail',
  twitter: 'Twitter',
  appwindow: 'AppWindow',
  github: 'Github',
  linkedin: 'Linkedin',
  pen: 'PenLine',
  play: 'Play',
  coffee: 'Coffee',
  // new ones for badges/layout
  award: 'Award',
  badgecheck: 'BadgeCheck',
  circle: 'Circle',
  briefcase: 'Briefcase',
  target: 'Target',
  // sound controls
  volume: 'Volume',
  volume1: 'Volume1',
  volume2: 'Volume2',
  volumex: 'VolumeX',
  mute: 'VolumeX',
  soundon: 'Volume2',
  soundoff: 'VolumeX',
  audio: 'Volume2'
};

const resolvedName = computed<IconKey>(() => {
  const raw = String(props.name ?? '').trim();
  const byEmoji = emojiMap[raw];
  if (byEmoji && (Lucide as any)[byEmoji]) return byEmoji as IconKey;
  const key = raw.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const byName = nameMap[key];
  if (byName && (Lucide as any)[byName]) return byName as IconKey;
  if (/bolt|flash|lightning/.test(raw)) return 'Zap';
  if (/spark|star|glow/.test(raw)) return 'Sparkles';
  if (/bug|issue|error/.test(raw)) return 'Bug';
  if (/tool|wrench|build|fix/.test(raw)) return 'Wrench';
  if (/laptop|desktop|computer|pc/.test(raw)) return 'Monitor';
  return 'Circle';
});

const IconComp = computed(() => (Lucide as any)[resolvedName.value] || (Lucide as any).Circle);
</script>
