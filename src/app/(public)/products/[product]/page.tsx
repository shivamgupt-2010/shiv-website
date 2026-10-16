import type { Metadata } from 'next';
import db from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';
import DigitalProductDetailClient from './DigitalProductDetailClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './page.module.css';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSiteUrl } from '@/lib/siteUrl';
import { getDigitalProductBySlug, getDigitalProductsByCategory } from '@/lib/digitalProducts';

export async function generateMetadata({ params }: { params: Promise<{ product: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.product;
  const baseUrl = getSiteUrl();

  // 1. Check digital product catalog
  const digital = await getDigitalProductBySlug(slug);
  if (digital) {
    const metaTitle = `${digital.name} | SHIV Shop`;
    const metaDesc = digital.description || `Download ${digital.name} source code and developer assets on SHIV Shop.`;
    return {
      title: metaTitle,
      description: metaDesc,
      keywords: [
        digital.name,
        digital.categoryLabel,
        ...digital.techStack,
        'SHIV digital assets',
        'code templates',
        'software starters',
      ],
      openGraph: {
        title: metaTitle,
        description: metaDesc,
        url: `${baseUrl}/products/${digital.slug}`,
        siteName: 'SHIV Shop',
        images: [
          {
            url: digital.screenshotUrl || `${baseUrl}/icon.svg`,
            width: 1200,
            height: 630,
            alt: digital.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDesc,
        images: [digital.screenshotUrl || `${baseUrl}/icon.svg`],
      },
    };
  }

  // 2. Fallback to database
  const product = await db.product.findUnique({
    where: { slug },
    include: { images: true },
  });

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const imgUrl = product.images[0]?.url || `${baseUrl}/icon.svg`;

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} on the official SHIV Store for ₹${product.price.toLocaleString('en-IN')}.`,
    keywords: [
      product.name,
      'SHIV store',
      'SHIV products',
      'buy SHIV',
      'SHIV developer resources',
    ],
    openGraph: {
      title: `${product.name} | SHIV Store`,
      description: product.description || `Buy ${product.name} for ₹${product.price.toLocaleString('en-IN')} on the official SHIV Store.`,
      url: `${baseUrl}/products/${product.slug}`,
      siteName: 'SHIV Store',
      images: [
        {
          url: imgUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | SHIV Store`,
      description: product.description || `Available now on the official SHIV Store for ₹${product.price.toLocaleString('en-IN')}.`,
      images: [imgUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ product: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.product;
  const baseUrl = getSiteUrl();
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  // 1. Check digital products catalog
  const digitalProduct = await getDigitalProductBySlug(slug);
  if (digitalProduct) {
    const categoryProducts = await getDigitalProductsByCategory(digitalProduct.category);
    const relatedProducts = categoryProducts
      .filter((p) => p.id !== digitalProduct.id && p.slug !== digitalProduct.slug)
      .slice(0, 4);

    const digitalSchema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: digitalProduct.name,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Cross-platform',
      description: digitalProduct.description,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: digitalProduct.price,
        availability: 'https://schema.org/InStock',
        url: `${baseUrl}/products/${digitalProduct.slug}`,
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(digitalSchema) }}
        />
        <DigitalProductDetailClient
          product={digitalProduct}
          relatedProducts={relatedProducts}
          userId={userId}
        />
      </>
    );
  }

  // 2. Fallback to database
  const product = await db.product.findUnique({
    where: { slug },
    include: { categories: true, variants: true, images: true },
  });

  if (!product) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', paddingTop: '10vh' }}>
          <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: '1rem' }}>Product not found</h1>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
            The product you requested might have been moved or updated.
          </p>
          <Link href="/products" className={styles.backLink}>
            <ArrowLeft size={16} /> Back to Marketplace Catalogue
          </Link>
        </div>
      </div>
    );
  }

  // Extract variants by name based on our seeder pattern
  const sizes = product.variants.filter((v) => v.name === 'Size').map((v) => v.value);
  const variants = product.variants.filter((v) => v.name === 'Variant').map((v) => v.value);

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
    images: product.images.map((img) => img.url),
  };

  let isWishlisted = false;
  if (userId) {
    const wishlistItem = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: product.id,
        },
      },
    });
    if (wishlistItem) {
      isWishlisted = true;
    }
  }

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: formattedProduct.images.length > 0 ? formattedProduct.images : [`${baseUrl}/icon.svg`],
    description: product.description || `Official ${product.name} from SHIV Store.`,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'SHIV Store',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      availability:
        product.status === 'OUT_OF_STOCK'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'SHIV Store',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient
        product={formattedProduct}
        userId={userId}
        isWishlisted={isWishlisted}
      />
    </>
  );
}
