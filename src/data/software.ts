export interface SoftwareProduct {
  id: string;
  name: string;
  slug: string;
  headline: string;
  description: string;
  status: 'Launched' | 'Beta' | 'In Development';
  features: string[];
}

export const software: SoftwareProduct[] = [
  {
    id: '1',
    name: 'SHIV Launcher',
    slug: 'shiv-launcher',
    headline: 'Your device. Your way.',
    description: 'A minimal, fast and customizable device launcher for a better digital experience. V1 is being prepared for public launch.',
    status: 'In Development',
    features: ['Customizable Home Screen', 'Quick App Access', 'Light & Dark Mode', 'Fast & Lightweight'],
  },
  {
    id: '2',
    name: 'SHIV JEE Practice',
    slug: 'shiv-jee-practice',
    headline: 'Practice. Improve. Achieve.',
    description: 'Customizable JEE practice platform with tests, PYQs, mistakes and analytics.',
    status: 'Beta',
    features: ['Chapter-wise Tests', 'PYQ Bank', 'Mistake Tracking', 'Performance Analytics'],
  },
  {
    id: '3',
    name: 'SHIV AI',
    slug: 'shiv-ai',
    headline: 'One Brand | Endless Possibilities',
    description: 'AI-powered infrastructure and services being developed by SHIV.',
    status: 'In Development',
    features: ['AI Tools & Assistants', 'Automation Services', 'Custom AI Solutions', 'API Integration'],
  },
];
