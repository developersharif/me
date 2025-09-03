import theme from '../data/theme.json';

type Theme = typeof theme;

export function useTheme(custom?: Partial<Theme>) {
  const t = { ...theme, ...(custom || {}) } as Theme;
  const root = document.documentElement;

  // Colors
  root.style.setProperty('--color-accent', t.colors.accent);
  root.style.setProperty('--color-secondary', t.colors.secondary);
  root.style.setProperty('--color-side-btn-bg', t.colors.sideButtonBg);
  root.style.setProperty('--color-side-btn-border', t.colors.sideButtonBorder);
  root.style.setProperty('--color-glass-bg', t.colors.glassBg);
  root.style.setProperty('--color-glass-border', t.colors.glassBorder);
  root.style.setProperty('--color-text', t.colors.text);

  // Background gradient
  root.style.setProperty('--bg-from', t.backgroundGradient.from);
  root.style.setProperty('--bg-via', t.backgroundGradient.via);
  root.style.setProperty('--bg-to', t.backgroundGradient.to);

  // Indicator
  root.style.setProperty('--indicator-from', t.indicatorGradient.from);
  root.style.setProperty('--indicator-to', t.indicatorGradient.to);
  root.style.setProperty('--indicator-shadow', t.indicatorGradient.shadow);

  // Progress
  root.style.setProperty('--progress-from', t.progressGradient.from);
  root.style.setProperty('--progress-to', t.progressGradient.to);

  // Radii
  root.style.setProperty('--radius-container', t.radii.container);
  root.style.setProperty('--radius-button', t.radii.button);

  // Blur
  root.style.setProperty('--blur-bg', `${t.blur.background}px`);
  root.style.setProperty('--blur-glass', `${t.blur.glass}px`);

  return t;
}
