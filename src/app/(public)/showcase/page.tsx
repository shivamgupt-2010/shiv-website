import type { Metadata } from 'next';
import db from '@/lib/db';
import ShowcaseClient from './ShowcaseClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Showcase | Reels, Style Drops & Photos — SHIV Multipurpose Store',
  description: 'Explore video reels, fashion styling, canvas paintings, room decor, and software walkthroughs across the SHIV brand.',
  keywords: ['SHIV showcase', 'SHIV reels', 'streetwear reels', 'decor photos', 'canvas paintings showcase', 'SHIV styling'],
};

export default async function ShowcasePage() {
  const items = await db.showcaseItem.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  });

  return <ShowcaseClient initialItems={items} />;
}
