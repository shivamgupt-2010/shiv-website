import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About SHIV | Official Story & Philosophy — SHIV Store',
  description: 'Learn about SHIV, founded by Shivam Gupta. Explore our philosophy of Build, Design, Evolve, bringing premium developer products, high-grade apparel, and innovative software solutions.',
  keywords: [
    'About SHIV',
    'SHIV store',
    'Shivam Gupta',
    'SHIV founder',
    'SHIV brand',
    'SHIV philosophy',
  ],
};

export default function AboutPage() {
  return <AboutClient />;
}
