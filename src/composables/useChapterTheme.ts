import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './useSiteState';

export type ChapterTheme = 'paper' | 'accent' | 'ink';

interface ThemeTokens {
  '--bg': string;
  '--fg': string;
  '--muted': string;
  '--line': string;
  '--accent': string;
  '--accent-text': string;
}

/**
 * The whole page is one continuous surface: instead of sections painting
 * their own backgrounds, the root tokens tween as chapters enter the viewport.
 */
const THEMES: Record<ChapterTheme, ThemeTokens> = {
  paper: {
    '--bg': '#f3eee4',
    '--fg': '#0f0e0c',
    '--muted': 'rgba(15, 14, 12, 0.62)',
    '--line': 'rgba(15, 14, 12, 0.16)',
    '--accent': '#ff4f1f',
    '--accent-text': '#c93608',
  },
  accent: {
    '--bg': '#ff4f1f',
    '--fg': '#0f0e0c',
    '--muted': 'rgba(15, 14, 12, 0.7)',
    '--line': 'rgba(15, 14, 12, 0.26)',
    '--accent': '#0f0e0c',
    '--accent-text': '#0f0e0c',
  },
  ink: {
    '--bg': '#0f0e0c',
    '--fg': '#f3eee4',
    '--muted': 'rgba(243, 238, 228, 0.62)',
    '--line': 'rgba(243, 238, 228, 0.16)',
    '--accent': '#ff4f1f',
    '--accent-text': '#ff7a50',
  },
};

let current: ChapterTheme | null = null;

export function applyTheme(name: ChapterTheme, opts: { immediate?: boolean } = {}) {
  if (current === name) return;
  current = name;
  const tokens = THEMES[name];
  const root = document.documentElement;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tokens['--bg']);
  if (opts.immediate || prefersReducedMotion()) {
    gsap.killTweensOf(root);
    Object.entries(tokens).forEach(([k, v]) => root.style.setProperty(k, v));
    return;
  }
  gsap.to(root, { ...tokens, duration: 1, ease: 'power2.inOut', overwrite: 'auto' });
}

export function currentTheme() {
  return current;
}

/** Watch every [data-theme] section inside scope and tween tokens on entry. */
export function setupChapterThemes(scope: HTMLElement) {
  const sections = Array.from(scope.querySelectorAll<HTMLElement>('[data-theme]'));
  const triggers = sections.map((sec) =>
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 58%',
      end: 'bottom 58%',
      onEnter: () => applyTheme(sec.dataset.theme as ChapterTheme),
      onEnterBack: () => applyTheme(sec.dataset.theme as ChapterTheme),
    })
  );
  return () => triggers.forEach((t) => t.kill());
}
