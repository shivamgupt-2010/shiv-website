import db from '@/lib/db';
import ProductsClient from './ProductsClient';

export default async function ProductsPage() {
  const products = await db.product.findMany({
    include: { categories: true, images: true },
    where: { status: { not: 'ARCHIVED' } }, // optionally filter
  });

  const formattedProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.categories[0]?.name || 'Uncategorized',
    priceFormatted: `₹${p.price.toLocaleString('en-IN')}`,
    status: p.status,
    imageUrl: p.images[0]?.url || null,
  }));

  return <ProductsClient products={formattedProducts} />;
}
