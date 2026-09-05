const base = import.meta.env.BASE_URL || '/';

/** Resolve a public asset path against Vite's base URL (GitHub Pages safe). */
export const asset = (p: string) => base + p.replace(/^\//, '');

export const workSrc = (slug: string, w: 800 | 1600) => asset(`assets/work/${slug}-${w}.webp`);

export const workSrcset = (slug: string) => `${workSrc(slug, 800)} 800w, ${workSrc(slug, 1600)} 1600w`;
