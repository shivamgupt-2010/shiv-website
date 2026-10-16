import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { getFeaturedDigitalProducts, getDynamicCategories, getAllDigitalProducts } from '@/lib/digitalProducts';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'SHIV Shop | Premium Digital Assets, Website Templates & Developer Tools',
  description: 'Build Better. Launch Faster. Premium website templates, interactive animation components, React UI kits, FastAPI starters, and full-stack software kits engineered by SHIV.',
  keywords: [
    'SHIV shop',
    'SHIV store',
    'website templates',
    'UI kits',
    'developer tools',
    'React components',
    'FastAPI starter',
    'Next.js templates',
    'digital products marketplace',
    'Figma templates',
    'animation components',
  ],
  alternates: {
    canonical: '/',
  },
};

export default async function Home() {
  const [featuredProducts, categories, allProducts] = await Promise.all([
    getFeaturedDigitalProducts(8),
    getDynamicCategories(),
    getAllDigitalProducts(),
  ]);

  // Pick bundles
  const bundles = allProducts.filter((p) => p.category === 'bundles');

  return (
    <HomeClient
      featuredProducts={featuredProducts}
      categories={categories}
      bundles={bundles}
    />
  );
}
