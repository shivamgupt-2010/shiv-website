import type { MetadataRoute } from 'next';
import db from '@/lib/db';
import { getSiteUrl } from '@/lib/siteUrl';
import { getAllDigitalProducts } from '@/lib/digitalProducts';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  // 1. Fetch dynamic products from database and digital catalogue
  let productEntries: MetadataRoute.Sitemap = [];
  
  // A. Digital templates & starter kits
  try {
    const digitalProducts = await getAllDigitalProducts();
    const digitalEntries: MetadataRoute.Sitemap = digitalProducts.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
    productEntries = [...productEntries, ...digitalEntries];
  } catch (error) {
    console.error('Error generating sitemap digital products:', error);
  }

  // B. Database physical/custom products
  try {
    const products = await db.product.findMany({
      where: { status: 'ACTIVE' },
      select: { slug: true, updatedAt: true },
    });

    const dbEntries: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
    productEntries = [...productEntries, ...dbEntries];
  } catch (error) {
    console.error('Error generating sitemap database products:', error);
  }

  // C. Dynamic Blog Posts
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const blogPosts = await db.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    blogEntries = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
  } catch (error) {
    console.error('Error generating sitemap blog entries:', error);
  }

  // 2. Public high-priority routes for Google indexing
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ceo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/shivam-gupta`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/showcase`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/software`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/software/shiv-launcher`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/business`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/business/services`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.65,
    },
  ];

  return [...staticEntries, ...productEntries, ...blogEntries];
}
