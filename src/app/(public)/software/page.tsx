import type { Metadata } from 'next';
import db from '@/lib/db';
import ClientSoftwarePage from './SoftwarePageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Software & Developer Tools | SHIV Store',
  description: 'Download and explore high-performance software, developer utilities, and digital assets crafted by SHIV.',
  keywords: ['SHIV software', 'SHIV store', 'developer tools', 'SHIV digital products', 'tech downloads'],
};

export default async function SoftwarePage() {
  const software = await db.softwareProduct.findMany();

  return <ClientSoftwarePage software={software} />;
}
