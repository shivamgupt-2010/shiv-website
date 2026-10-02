import db from '@/lib/db';
import HomeClient from './HomeClient';

export default async function Home() {
  // Fetch up to 4 active products to feature on the homepage
  const products = await db.product.findMany({
    where: { status: 'ACTIVE' },
    take: 4,
    include: { images: true },
  });

  const featuredProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    priceFormatted: `₹${p.price.toLocaleString('en-IN')}`,
    imageUrl: p.images[0]?.url || null,
  }));

  const reviews = await db.review.findMany({
    where: {
      featured: true,
      hidden: false,
    },
    take: 6,
    orderBy: { id: 'desc' },
  });

  return <HomeClient featuredProducts={featuredProducts} featuredReviews={reviews} />;
}
