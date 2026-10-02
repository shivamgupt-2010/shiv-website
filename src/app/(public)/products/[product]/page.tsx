import db from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './page.module.css';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function ProductDetailPage({ params }: { params: Promise<{ product: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.product;

  const product = await db.product.findUnique({
    where: { slug },
    include: { categories: true, variants: true, images: true }
  });

  if (!product) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', paddingTop: '10vh' }}>
          <h1>Product not found</h1>
          <Link href="/products" className={styles.backLink} style={{ marginTop: '2rem' }}>
            <ArrowLeft size={16} /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Extract variants by name based on our seeder pattern
  const sizes = product.variants.filter(v => v.name === 'Size').map(v => v.value);
  const variants = product.variants.filter(v => v.name === 'Variant').map(v => v.value);

  const formattedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.categories[0]?.name || 'Uncategorized',
    priceFormatted: `₹${product.price.toLocaleString('en-IN')}`,
    price: product.price,
    status: product.status,
    isCustomizable: product.customizable,
    sizes,
    variants,
    images: product.images.map(img => img.url),
  };

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  let isWishlisted = false;
  if (userId) {
    const wishlistItem = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: product.id,
        }
      }
    });
    if (wishlistItem) {
      isWishlisted = true;
    }
  }

  return <ProductDetailClient product={formattedProduct} userId={userId} isWishlisted={isWishlisted} />;
}
