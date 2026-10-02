import type { Metadata } from 'next';
import db from '@/lib/db';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'SHIV Store | Official Store & Products — Build. Design. Evolve.',
  description: 'Welcome to the official SHIV Store. Discover cutting-edge developer apparel, cyberpunk drops, high-performance tech wear, and digital tools created by SHIV.',
  keywords: [
    'SHIV store',
    'SHIV official store',
    'SHIV brand',
    'SHIV merch',
    'SHIV clothing',
    'buy SHIV',
    'SHIV apparel',
    'SHIV streetwear',
    'SHIV developers',
    'SHIV online shopping',
  ],
  alternates: {
    canonical: '/',
  },
};

export default async function Home() {
  let featuredProducts: { id: string; name: string; slug: string; priceFormatted: string; imageUrl: string | null }[] = [];
  let reviews: any[] = [];

  try {
    const products = await db.product.findMany({
      where: { status: 'ACTIVE' },
      take: 4,
      include: { images: true },
    });

    featuredProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      priceFormatted: `₹${p.price.toLocaleString('en-IN')}`,
      imageUrl: p.images[0]?.url || null,
    }));

    reviews = await db.review.findMany({
      where: {
        featured: true,
        hidden: false,
      },
      take: 6,
      orderBy: { id: 'desc' },
    });
  } catch (error) {
    console.error('Database connection error in Home page:', error);
  }

  return <HomeClient featuredProducts={featuredProducts} featuredReviews={reviews} />;
}
