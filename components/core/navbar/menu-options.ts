import type { TranslationKeys } from '@/lib/i18n/translations';

export interface NavItem {
  key: string;
  href: string;
  title: string;
  description: string;
}

export interface NavAppItem extends NavItem {
  includeInMobile: boolean;
}

type AppConfig = {
  key: string;
  href: string;
  title: (t: TranslationKeys) => string;
  description: (t: TranslationKeys) => string;
  includeInMobile?: boolean;
};

type PresentationConfig = {
  key: string;
  href: string;
  title: (t: TranslationKeys) => string;
  description: (t: TranslationKeys) => string;
};

const APP_CONFIG: AppConfig[] = [
  {
    key: 'wheel',
    href: '/wheel',
    title: t => t.nav.wheelOfFortune,
    description: t => t.nav.wheelDescription,
    includeInMobile: false,
  },
  {
    key: 'interactive',
    href: '/interactive',
    title: t => t.nav.interactiveProgramming,
    description: t => t.nav.interactiveDescription,
  },
  {
    key: 'sorting',
    href: '/sorting',
    title: t => t.nav.sortingAlgorithms,
    description: t => t.nav.sortingDescription,
  },
  {
    key: 'mazes',
    href: '/mazes',
    title: t => t.nav.mazes,
    description: t => t.nav.mazesDescription,
    includeInMobile: false,
  },
  {
    key: 'patterns',
    href: '/patterns',
    title: t => t.nav.interestingPatterns,
    description: t => t.nav.interestingPatternsDescription,
  },
  {
    key: 'object-detection',
    href: '/object-detection',
    title: t => t.nav.objectDetection,
    description: t => t.nav.objectDetectionDescription,
    includeInMobile: false,
  },
];

const PRESENTATION_CONFIG: PresentationConfig[] = [
  {
    key: 'view',
    href: '/questions/view',
    title: t => t.nav.viewQuestions,
    description: t => t.nav.viewQuestionsDescription,
  },
  {
    key: 'add',
    href: '/questions/add',
    title: t => t.nav.addQuestions,
    description: t => t.nav.addQuestionsDescription,
  },
];

export function createAppItems(t: TranslationKeys): NavAppItem[] {
  return APP_CONFIG.map(config => ({
    key: config.key,
    href: config.href,
    title: config.title(t),
    description: config.description(t),
    includeInMobile: config.includeInMobile === true,
  }));
}

export function createPresentationLinks(t: TranslationKeys): NavItem[] {
  return PRESENTATION_CONFIG.map(config => ({
    key: config.key,
    href: config.href,
    title: config.title(t),
    description: config.description(t),
  }));
}
