import type { Metadata } from 'next';
import db from '@/lib/db';
import styles from './page.module.css';
import ClientBusinessPage from './BusinessPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Business Solutions & Engineering | SHIV Store',
  description: 'Custom software architecture, bespoke web development, and digital scaling solutions from SHIV.',
  keywords: ['SHIV business', 'SHIV engineering', 'custom software', 'SHIV consulting', 'SHIV solutions'],
};

export default async function BusinessPage() {
  const businessPackages = await db.businessPackage.findMany({
    where: { active: true },
    orderBy: { displayOrder: 'asc' }
  });

  const showcaseProjects = await db.project.findMany({
    where: { featured: true }
  });

  // Need to parse features from JSON
  const formattedPackages = businessPackages.map(pkg => ({
    ...pkg,
    features: JSON.parse(pkg.features) as string[]
  }));

  return <ClientBusinessPage packages={formattedPackages} projects={showcaseProjects} />;
}
