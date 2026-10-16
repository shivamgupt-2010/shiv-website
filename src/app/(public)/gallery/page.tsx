import type { Metadata } from 'next';
import db from '@/lib/db';
import ShowcaseClient from '../showcase/ShowcaseClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gallery & Media Showcase | SHIV Multipurpose Store',
  description: 'Explore the visual showcase, video reels, photo drops, design prototypes, and media from SHIV Store.',
  keywords: ['SHIV gallery', 'SHIV reels', 'media showcase', 'streetwear photos', 'decor canvas drops'],
};

export default async function GalleryPage() {
  const [showcaseItems, galleryItems] = await Promise.all([
    db.showcaseItem.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    }),
    db.galleryItem.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  // Combine showcase items with any legacy gallery items
  const combined = [
    ...showcaseItems,
    ...galleryItems.map((g) => ({
      id: g.id,
      title: g.title,
      description: null,
      type: g.type === 'INSTAGRAM' ? 'REEL' : 'VIDEO',
      mediaUrl: g.url,
      thumbnailUrl: null,
      aspectRatio: '9:16',
      category: 'Showcase',
      tags: null,
      productLink: '/products',
      likes: 12,
      featured: true,
    })),
  ];

  return <ShowcaseClient initialItems={combined} />;
}
