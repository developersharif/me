export type Level = 'master' | 'adept' | 'familiar' | 'novice';

export interface ImageRef {
  slug: string;
  w: number;
  h: number;
  alt: string;
  fit?: 'cover' | 'contain';
  caption?: string;
}

export interface NavItem {
  id: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  kicker?: string;
  desc: string;
  link?: string;
  repo?: string;
  tech?: string[];
  image?: ImageRef;
  plate?: { type: 'terminal'; lines: string[] };
}

export interface MoreProject {
  title: string;
  desc: string;
  link?: string;
  repo?: string;
  tech?: string[];
}

export interface Skill {
  name: string;
  level: Level;
  description: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  subtitle: string;
  skills: Skill[];
}

export interface TimelineItem {
  year: string;
  title: string;
  desc: string;
}

export interface PortfolioData {
  site: { name: string; title: string; since: number; stack: string };
  nav: NavItem[];
  hero: {
    eyebrow: string;
    name: string;
    role: string;
    intro: string;
    meta: string[];
    scrollHint: string;
  };
  about: {
    heading: string;
    lede: string;
    story: string[];
    highlightsTitle: string;
    highlights: { icon: string; text: string }[];
    focus: {
      researchTitle: string;
      research: string[];
      learningTitle: string;
      learning: string[];
    };
    plates: ImageRef[];
    timelineTitle: string;
    timeline: TimelineItem[];
  };
  skills: {
    heading: string;
    intro: string;
    levels: Record<Level, { bars: number; label: string }>;
    marquee: string[];
    groups: SkillGroup[];
  };
  work: {
    heading: string;
    intro: string;
    featured: Project[];
    moreTitle: string;
    more: MoreProject[];
  };
  experience: {
    heading: string;
    intro: string;
    entries: { title: string; org: string; period: string; desc: string }[];
  };
  writing: { heading: string; intro: string; medium: string };
  contact: {
    heading: string;
    line: string;
    email: string;
    links: { label: string; href: string }[];
    cv: string;
    status: string;
  };
}
