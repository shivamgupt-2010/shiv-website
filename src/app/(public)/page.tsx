import db from '@/lib/db';
import HomeClient from './HomeClient';

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
