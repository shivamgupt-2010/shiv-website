import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import { getAllDigitalProducts, getDynamicCategories } from '@/lib/digitalProducts';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Digital Products Catalogue | Website Templates, UI Kits & Starters | SHIV Shop',
  description: 'Explore the complete SHIV digital asset catalogue. High-performance website templates, React UI components, FastAPI backend starters, and full-stack software kits.',
  keywords: [
    'SHIV digital products',
    'website templates',
    'developer tools',
    'React components',
    'FastAPI starter',
    'UI kits',
    'Next.js boilerplates',
    'software starter kits',
  ],
  alternates: {
    canonical: '/products',
  },
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getAllDigitalProducts(),
    getDynamicCategories(),
  ]);

  return <ProductsClient products={products} categories={categories} />;
}
