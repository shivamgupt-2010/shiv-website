import type { Metadata } from 'next';
import db from '@/lib/db';
import ClientSoftwarePage from './SoftwarePageClient';
import { getMergedTemplates } from '@/lib/templatesManager';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'SHIV Templates Marketplace | Website UI, Kits & Developer Assets',
  description: 'Download high-performance website templates, React UI components, backend APIs, and developer automation tools crafted by SHIV store.',
  keywords: [
    'SHIV software',
    'SHIV store',
    'website templates',
    'developer tools',
    'React components',
    'Next.js starters',
    'digital downloads',
    'SHIV marketplace',
  ],
};

export default async function SoftwarePage() {
  const [software, templates] = await Promise.all([
    db.softwareProduct.findMany().catch(() => []),
    getMergedTemplates(),
  ]);

  return <ClientSoftwarePage software={software} templates={templates} />;
}
