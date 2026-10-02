import db from '@/lib/db';
import ClientSoftwarePage from './SoftwarePageClient';

export const dynamic = 'force-dynamic';

export default async function SoftwarePage() {
  const software = await db.softwareProduct.findMany();

  return <ClientSoftwarePage software={software} />;
}
